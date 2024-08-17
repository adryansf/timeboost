import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { User } from '@prisma/client';

// Services
import { PrismaService } from '@/database/prisma.service';

// Dtos
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

// Repository
import { UserRepository } from './user.repository';

// Pagination
import { PAGINATION } from '@/config/pagination';

describe('UserRepository', () => {
  let prisma: PrismaService;
  let repository: UserRepository;
  let users: User[];

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
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(async () => [users.length, users]),
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
                  data: UpdateUserDto;
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
                const user = users.find((u) => u.id === where.id);

                users = users.filter((u) => u.id !== where.id);

                return user;
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
        UserRepository,
      ],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should return a user by username', async () => {
    // Arrange
    const username = users[0].username;
    // Act
    const result = await repository.findByUsername(username);
    // Assert
    expect(result).toBe(users[0]);
  });

  it('should return a user by id', async () => {
    // Arrange
    const id = users[0].id;
    // Act
    const result = await repository.findById(id);
    // Assert
    expect(result).toBe(users[0]);
  });

  it('should return a user by email', async () => {
    // Arrange
    const email = users[0].email;
    // Act
    const result = await repository.findByEmail(email);
    // Assert
    expect(result).toBe(users[0]);
  });

  it('should return a deleted user', async () => {
    // Arrange
    const user = users[0];
    // Act
    const result = await repository.delete(user.id);
    // Assert
    expect(result).toBe(user);
  });

  it('should return a pagination of users', async () => {
    // Arrange
    const page = 1;
    // Act
    const result = await repository.findWithPagination({
      skip: PAGINATION.users * (page - 1),
      take: PAGINATION.users,
    });

    // Assert
    expect(result).toEqual([users.length, users]);
  });

  it('should return a created user', async () => {
    // Arrange
    const createUserDto: CreateUserDto = {
      email: 'testeuser@gmail.com',
      username: 'testuser',
      password: '12345678',
    };
    // Act
    const result = await repository.create(createUserDto);
    // Assert
    expect(result).toEqual({ ...users[users.length - 1], ...createUserDto });
  });

  it('should return a updated user', async () => {
    // Arrange
    const id = users[0].id;
    const updateUserDto: UpdateUserDto = {
      email: 'testeuser@gmail.com',
      username: 'testuser',
      password: '12345678',
    };
    // Act
    const result = await repository.update(id, updateUserDto);
    // Assert
    expect(result).toEqual({
      ...users[0],
      ...updateUserDto,
    });
  });
});
