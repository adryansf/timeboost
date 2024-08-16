import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import {} from '@prisma/client';

// Services
import { UsersService } from './users.service';
import { PrismaService } from '@/database/prisma.service';

// Dtos
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Entities
import { UserEntity } from './entities/user.entity';

// Messages
import { MESSAGES } from '@/common/messages';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  let users: UserEntity[];

  beforeEach(async () => {
    users = [...Array(15).keys()].map((i) => ({
      id: randomUUID(),
      username: `user${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '12345678',
      email: `user${i}@timeboost.com`,
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(() => [users.length, users]),
            user: {
              findUnique: jest.fn((params: { where: { id: string } }) =>
                users.find((u) => u.id === params.where.id),
              ),
              create: jest.fn(({ data }: { data: CreateUserDto }) => {
                const createdUser = {
                  id: randomUUID(),
                  ...data,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                };

                users.push(createdUser);

                return createdUser;
              }),
              update: jest.fn(
                ({
                  data,
                  where,
                }: {
                  data: CreateUserDto;
                  where: { id: string };
                }) => {
                  const updatedUser = {
                    ...users.find((u) => u.id === where.id),
                    ...data,
                  };

                  users = users.map((u) =>
                    u.id === where.id ? updatedUser : u,
                  );

                  return updatedUser;
                },
              ),
              delete: jest.fn(({ where }: { where: { id: string } }) => {
                users = users.filter((u) => u.id !== where.id);

                return true;
              }),
              findFirst: jest.fn(
                (params: { where: { username?: string; email?: string } }) => {
                  return users.find((u) =>
                    params.where?.email
                      ? u.email === params.where.email
                      : params.where?.username
                        ? u.username === params.where.username
                        : false,
                  );
                },
              ),
              findMany: jest.fn(() => users),
              count: jest.fn(() => users.length),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
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
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        ...createUserDto,
        password: expect.any(String),
      },
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
    await service.findOne(username);

    // Assert
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        username,
      },
    });
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
    expect(prisma.user.update).toHaveBeenCalledWith({
      data: updateUserDto,
      where: {
        id: id,
      },
    });

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
    const id = users[0].id;

    // Act
    await service.remove(id);

    // Assert
    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: {
        id: id,
      },
    });
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
