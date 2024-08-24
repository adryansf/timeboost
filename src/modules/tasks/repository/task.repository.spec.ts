import { Test, TestingModule } from '@nestjs/testing';
import { Task } from '@prisma/client';
import { randomUUID } from 'crypto';

// Services
import { PrismaService } from '@/database/prisma.service';

// Repository
import { TaskRepository } from './task.repository';

describe('TasksService', () => {
  let tasks: Task[];
  let repository: TaskRepository;

  beforeEach(async () => {
    tasks = [
      {
        id: 1,
        completed: true,
        createdAt: new Date(),
        dueDate: new Date(),
        description: 'task teste',
        title: 'task para teste',
        idUser: randomUUID(),
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskRepository,
        {
          provide: PrismaService,
          useValue: {
            task: {
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
        },
      ],
    }).compile();

    repository = module.get<TaskRepository>(TaskRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should return a Task Created', async () => {
    // Arrange
    const taskToCreate: Omit<Omit<Task, 'id'>, 'createdAt'> = {
      title: 'Task Teste',
      description: 'task para teste',
      idUser: randomUUID(),
      dueDate: new Date(),
      completed: false,
    };
    // Act
    const result = await repository.create(taskToCreate);
    // Assert
    expect(result).toBe(tasks[tasks.length - 1]);
  });
});
