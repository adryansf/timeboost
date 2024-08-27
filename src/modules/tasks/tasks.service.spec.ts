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
import { UpdateTaskDto } from './dto/update-task.dto';

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

  it('should create a task successfully', async () => {
    // Arrange
    const createTaskDto: CreateTaskDto = {
      title: 'New Task',
      description: 'New Description',
      idUser: users[0].id,
      dueDate: new Date(),
    };

    // Act
    const result = await service.create(createTaskDto);

    // Assert
    expect(result).toEqual({
      ...createTaskDto,
      id: tasks[tasks.length - 1].id + 1,
      completed: false,
      createdAt: expect.any(Date),
    });
    expect(service['repoTask'].create).toHaveBeenCalledWith({
      ...createTaskDto,
      completed: false,
    });
  });

  it('should throw NotFoundException when creating a task with a non-existing user', async () => {
    // Arrange
    const createTaskDto: CreateTaskDto = {
      title: 'New Task',
      description: 'New Description',
      idUser: randomUUID(),
      dueDate: new Date(),
    };

    jest.spyOn(service['repoUser'], 'findById').mockResolvedValueOnce(null);

    // Act & Assert
    await expect(service.create(createTaskDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return a task when findOne is called with an existing id', async () => {
    // Act
    const result = await service.findOne(tasks[0].id);

    // Assert
    expect(result).toBe(tasks[0]);
  });

  it('should throw NotFoundException when findOne is called with a non-existing id', async () => {
    // Arrange
    jest.spyOn(service['repoTask'], 'findById').mockResolvedValueOnce(null);

    // Act & Assert
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a task successfully', async () => {
    // Arrange
    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Task',
      description: 'Updated Description',
      completed: true,
    };

    jest.spyOn(service['repoTask'], 'update').mockResolvedValueOnce({
      ...tasks[0],
      ...updateTaskDto,
    });

    // Act
    const result = await service.update(tasks[0].id, updateTaskDto);

    // Assert
    expect(result).toEqual({
      ...tasks[0],
      ...updateTaskDto,
    });
  });

  it('should throw NotFoundException when updating a task with a non-existing id', async () => {
    // Arrange
    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Task',
      description: 'Updated Description',
      completed: true,
    };

    jest.spyOn(service['repoTask'], 'findById').mockResolvedValueOnce(null);

    // Act & Assert
    await expect(service.update(999, updateTaskDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should remove a task successfully', async () => {
    // Arrange
    jest.spyOn(service['repoTask'], 'delete').mockResolvedValueOnce(tasks[0]);

    // Act
    const result = await service.remove(tasks[0].id);

    // Assert
    expect(result).toBe(tasks[0]);
  });

  it('should throw NotFoundException when removing a task with a non-existing id', async () => {
    // Arrange
    jest.spyOn(service['repoTask'], 'findById').mockResolvedValueOnce(null);

    // Act & Assert
    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });
});
