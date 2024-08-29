import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { randomUUID } from 'crypto';

// Dto
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationUsersDto } from './dto/pagination-users.dto';

// Entities
import { UserEntity } from './entities/user.entity';

// Interfaces
import { IConstructorPaginationUsersDto } from './dto/pagination-users.dto';

// Messages
import { MESSAGES } from '@/utils/messages';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  let users: UserEntity[];

  beforeEach(async () => {
    users = [...Array(15).keys()].map((i) => ({
      id: randomUUID(),
      username: `user${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '12345678',
      email: `user${i}@timeboost.com`,
      idLevel: 1,
    }));

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn((dto: CreateUserDto) => {
              const createdUser = {
                id: randomUUID(),
                ...dto,
                idLevel: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
              };

              users.push(createdUser);

              return createdUser;
            }),
            findAll: jest.fn().mockResolvedValue({
              users,
              totalUsers: users.length,
              page: 1,
            } as IConstructorPaginationUsersDto),
            findOne: jest.fn((username: string) =>
              users.find((u) => u.username === username),
            ),
            update: jest.fn((id: string, dto: UpdateUserDto) => {
              const updatedUser = { ...users.find((u) => u.id === id), ...dto };

              users = users.map((u) => (u.id === id ? { ...u, ...dto } : u));

              return updatedUser;
            }),
            remove: jest.fn(async (id: string) => {
              const user = users.find((u) => u.id === id);
              users = users.filter((u) => u.id !== id);

              return user;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should return a pagination of users', async () => {
    // Arrange
    const query = {};

    // Act
    const result = await controller.findAll(query);
    // Assert
    expect(service.findAll).toHaveBeenCalledWith(query);
    expect(result).toBeInstanceOf(PaginationUsersDto);
    expect(result).toEqual({
      page: 1,
      totalPages: 1,
      users,
      totalUsers: users.length,
      usersInPage: users.length,
    } as PaginationUsersDto);
  });

  it('should create a user', async () => {
    // Arrange
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    // Act
    const result = await controller.create(createUserDto);

    // Assert
    expect(service.create).toHaveBeenCalledWith(createUserDto);
    expect(result).toBeInstanceOf(UserEntity);
  });

  it('should find a user by username', async () => {
    // Arrange
    const username = users[0].username;

    // Act
    const result = await controller.findOne(username);

    // Assert
    expect(service.findOne).toHaveBeenCalledWith(username);
    expect(result).toBeInstanceOf(UserEntity);
  });

  it('should update a user', async () => {
    // Arrange
    const updateUserDto: UpdateUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    // Act
    const result = await controller.update(users[0].id, updateUserDto);

    // Assert
    expect(service.update).toHaveBeenCalledWith(users[0].id, updateUserDto);
    expect(result).toBeUndefined();
  });

  it('should delete a user', async () => {
    // Arrange
    const id = users[0].id;

    // Act
    const result = await controller.remove(id);

    // Assert
    expect(service.remove).toHaveBeenCalledWith(id);
    expect(result).toBeUndefined();
  });
});
