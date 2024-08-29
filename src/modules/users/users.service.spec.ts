import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { User } from '@prisma/client';

// Services
import { UsersService } from './users.service';
// Dtos
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Repository
import { UserRepository } from './repository/user.repository';

// Utils
import { MESSAGES } from '@/utils/messages';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UserRepository;

  let users: User[];

  beforeEach(async () => {
    users = [...Array(15).keys()].map((i) => ({
      id: randomUUID(),
      username: `user${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '12345678',
      idLevel: 1,
      email: `user${i}@timeboost.com`,
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(async (id: string) =>
              users.find((u) => u.id === id),
            ),
            findByUsername: jest.fn(async (username: string) =>
              users.find((u) => u.username == username),
            ),
            findByEmail: jest.fn(async (email: string) =>
              users.find((u) => u.email == email),
            ),
            findWithPagination: jest.fn(() =>
              Promise.resolve([users.length, users]),
            ),
            create: jest.fn(async (data: CreateUserDto) => {
              const createdUser = {
                id: randomUUID(),
                ...data,
                idLevel: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
              };

              users.push(createdUser);

              return createdUser;
            }),
            update: jest.fn(async (id: string, data: UpdateUserDto) => {
              const updatedUser = {
                ...users.find((u) => u.id === id),
                ...data,
              };

              users = users.map((u) => (u.id === id ? updatedUser : u));

              return updatedUser;
            }),
            delete: jest.fn(async (id: string) => {
              const user = users.find((u) => u.id === id);
              users = users.filter((u) => u.id !== id);

              return user;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should create a user with an encrypted password', async () => {
    // Arrange
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      email: 'test@timeboost.com',
      password: '12345678',
    };

    // Act
    const result = await service.create(createUserDto);

    // Assert
    expect(result).toEqual(users[users.length - 1]);
    expect(repository.create).toHaveBeenCalledWith({
      ...createUserDto,
      idLevel: 1,
      password: expect.any(String),
    });

    // Verifica se a senha foi corretamente encriptada
    const isPasswordMatching = await bcrypt.compare(
      createUserDto.password,
      result.password,
    );
    expect(isPasswordMatching).toBe(true);
  });

  it('should throws an error if email not unique', async () => {
    // Arrange
    const createUserDto: CreateUserDto = {
      username: 'notexist',
      email: users[0].email,
      password: '12345678',
    };

    // Act and Assert
    await expect(service.create(createUserDto)).rejects.toThrow(
      new BadRequestException(
        MESSAGES.exception.user.BadRequest.EmailNotUnique,
      ),
    );
  });

  it('should throws an error if username not unique', async () => {
    // Arrange
    const createUserDto: CreateUserDto = {
      username: users[0].username,
      email: 'notexist@timeboost.com',
      password: '12345678',
    };

    // Act and Assert
    await expect(service.create(createUserDto)).rejects.toThrow(
      new BadRequestException(
        MESSAGES.exception.user.BadRequest.UsernameNotUnique,
      ),
    );
  });

  it('should find a user by username', async () => {
    // Arrange
    const username = users[0].username;

    // Act
    const result = await service.findOne(username);

    // Assert
    expect(result).toEqual(users[0]);
    expect(repository.findByUsername).toHaveBeenCalledWith(username);
  });

  it('should throw an error if user not found on create', async () => {
    // Arrange
    const username = 'notexists';

    // Act and Assert
    await expect(service.findOne(username)).rejects.toThrow(
      new NotFoundException(MESSAGES.exception.user.NotFound),
    );
  });

  it('should update a user with an encrypted password', async () => {
    // Arrange
    const id = users[0].id;
    const password = 'updatedpassword';
    const updateUserDto: UpdateUserDto = {
      username: 'updateduser',
      email: 'updateduser@timeboost.com',
      password: password,
    };

    // Act
    const result = await service.update(id, updateUserDto);

    // Assert
    expect(result).toEqual({
      ...users[0],
      ...updateUserDto,
    });
    expect(repository.update).toHaveBeenCalledWith(id, updateUserDto);

    // Verifica se a senha foi corretamente encriptada
    const isPasswordMatching = await bcrypt.compare(password, result.password);
    expect(isPasswordMatching).toBe(true);
  });

  it('should throw an error if user not found on update', async () => {
    // Act and Assert
    await expect(service.update(randomUUID(), {})).rejects.toThrow(
      new NotFoundException(MESSAGES.exception.user.NotFound),
    );
  });

  it('should delete a user', async () => {
    // Arrange
    const userToDelete = users[0];
    const id = userToDelete.id;

    // Act
    const result = await service.remove(id);

    // Assert
    expect(result).toBe(userToDelete);
    expect(repository.delete).toHaveBeenCalledWith(id);
  });

  it('should throw an error if user not found on delete', async () => {
    // Act and Assert
    await expect(service.remove(randomUUID())).rejects.toThrow(
      new NotFoundException(MESSAGES.exception.user.NotFound),
    );
  });

  it('should find many users with pagination', async () => {
    // Act
    const result = await service.findAll({});
    // Assert
    expect(result).toEqual({
      users,
      page: 1,
      totalUsers: users.length,
    });
  });
});
