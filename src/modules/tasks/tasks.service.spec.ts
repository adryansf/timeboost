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
  let repoTask: TaskRepository;
  let repoUser: UserRepository;

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
            findById: jest.fn((id: number) => {
              return tasks.find((task) => task.id === id);
            }),
            update: jest.fn((id: number, data: UpdateTaskDto) => {
              const taskIndex = tasks.findIndex((task) => task.id === id);
              tasks[taskIndex] = { ...tasks[taskIndex], ...data };
              return tasks[taskIndex];
            }),
            delete: jest.fn((id: number) => {
              const task = tasks.find((t) => t.id === id);

              tasks = tasks.filter((t) => t.id !== id);

              return task;
            }),
            findAll: jest.fn(() => tasks),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repoTask = module.get<TaskRepository>(TaskRepository);
    repoUser = module.get<UserRepository>(UserRepository);
  });

  it('should create a Task', async () => {
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
    expect(repoTask.create).toHaveBeenCalledWith({
      ...createTaskDto,
      completed: false,
    });
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
      id: tasks[tasks.length - 1].id,
      completed: false,
      createdAt: expect.any(Date),
    });
    expect(repoTask.create).toHaveBeenCalledWith({
      ...createTaskDto,
      completed: false,
    });
  });

  it('should return a task when findOne is called with an existing id', async () => {
    // Act
    const task = tasks[0];
    const id = task.id;
    const result = await service.findOne(id);

    // Assert
    expect(repoTask.findById).toHaveBeenCalledWith(id);
    expect(result).toBe(task);
  });

  it('should throw NotFoundException when findOne is called with a non-existing id', async () => {
    // Arrange
    const id = 999;

    // Act & Assert
    await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
  });

  it('should update a task successfully', async () => {
    // Arrange
    const id = tasks[0].id;
    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Task',
      description: 'Updated Description',
      completed: true,
    };

    // Act
    const result = await service.update(id, updateTaskDto);

    // Assert
    expect(repoTask.update).toHaveBeenCalledWith(+id, updateTaskDto);
    expect(result).toEqual({
      ...tasks[0],
      ...updateTaskDto,
    });
  });

  it('should throw NotFoundException when updating a task with a non-existing id', async () => {
    // Arrange
    const id = 999;
    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Task',
      description: 'Updated Description',
      completed: true,
    };

    // Act & Assert
    await expect(service.update(id, updateTaskDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should remove a task successfully', async () => {
    // Arrange
    const task = tasks[0];
    const id = task.id;

    // Act
    const result = await service.remove(id);

    // Assert
    expect(repoTask.delete).toHaveBeenCalledWith(id);
    expect(result).toBe(task);
  });

  it('should throw NotFoundException when removing a task with a non-existing id', async () => {
    // Arrange
    const id = 999;

    // Act & Assert
    await expect(service.remove(id)).rejects.toThrow(NotFoundException);
  });

  it('should return all tasks', async () => {
    // Act
    const result = await service.findAll();

    // Assert
    expect(repoTask.findAll).toHaveBeenCalled();
    expect(result).toBe(tasks);
  });
});
