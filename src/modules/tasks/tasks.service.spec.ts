import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Task, User } from '@prisma/client';
import { randomUUID } from 'crypto';

// Dtos
import { CreateTaskDto } from './dto/create-task.dto';

// Services
import { TasksService } from './tasks.service';
import { UserRepository } from '../users/repository/user.repository';
import { TaskRepository } from './repository/task.repository';

// Messages
import { MESSAGES } from '@/utils/messages';

describe('TasksService', () => {
  let users: User[];
  let tasks: Task[];
  let service: TasksService;

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

    tasks = [
      {
        id: 1,
        completed: true,
        createdAt: new Date(),
        dueDate: new Date(),
        description: 'task teste',
        title: 'task para teste',
        idUser: users[0].id,
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn((id: string) => {
              return users.find((u) => u.id === id);
            }),
          },
        },
        {
          provide: TaskRepository,
          useValue: {
            create: jest.fn((data: Omit<Omit<Task, 'id'>, 'createdAt'>) => {
              const createdTask = {
                id: tasks[tasks.length - 1].id + 1,
                ...data,
                createdAt: new Date(),
              } as Task;

              tasks.push(createdTask);
              return createdTask;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an Task', async () => {
    // Arrange
    const createTaskDto: CreateTaskDto = {
      title: 'Task Teste',
      description: 'task para teste',
      idUser: users[0].id,
      dueDate: new Date(),
    };
    // Act
    const result = await service.create(createTaskDto);
    // Assert
    expect(result).toBe(tasks[tasks.length - 1]);
  });

  it('should return a User NotFoundError', async () => {
    // Arrange
    const createTaskDto: CreateTaskDto = {
      title: 'Task Teste',
      description: 'task para teste',
      idUser: randomUUID(),
      dueDate: new Date(),
    };
    // Act && Assert
    await expect(service.create(createTaskDto)).rejects.toThrow(
      new NotFoundException(MESSAGES.exception.user.NotFound),
    );
  });
});
