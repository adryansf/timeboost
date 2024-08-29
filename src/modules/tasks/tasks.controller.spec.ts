import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';

// Dtos
import { CreateTaskDto } from './dto/create-task.dto';

// Entities
import { TaskEntity } from './entities/task.entity';

// Messages
import { MESSAGES } from '@/utils/messages';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;
  let tasks: Task[];

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
      controllers: [TasksController],

      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn((data: CreateTaskDto) => ({
              id: 1,
              ...data,
              createdAt: new Date(),
            })),
            findAll: jest.fn(() => tasks),
            findOne: jest.fn((id: number) =>
              tasks.find((task) => task.id === id),
            ),

            update: jest.fn((id: number, dto: UpdateTaskDto) => {
              const updatedTask = { ...tasks.find((t) => t.id === id), ...dto };

              tasks = tasks.map((t) => (t.id === id ? { ...t, ...dto } : t));

              return updatedTask;
            }),
            remove: jest.fn(async (id: number) => {
              const task = tasks.find((t) => t.id === id);
              tasks = tasks.filter((t) => t.id !== id);

              return task;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be return a Task Entity on Create', async () => {
    // Arrange
    const createTaskDto: CreateTaskDto = {
      title: 'Task Teste',
      description: 'task para teste',
      idUser: randomUUID(),
      dueDate: new Date(),
    };
    // Act
    const result = await controller.create(createTaskDto);
    // Assert
    expect(result).toBeInstanceOf(TaskEntity);
  });

  it('should be return a NotFoundError when not exists an user', async () => {
    // Arrange
    const createTaskDto: CreateTaskDto = {
      title: 'Task Teste',
      description: 'task para teste',
      idUser: randomUUID(),
      dueDate: new Date(),
    };
    service.create = jest.fn(() => {
      throw new NotFoundException(MESSAGES.exception.user.NotFound);
    });
    // Act & Assert
    await expect(controller.create(createTaskDto)).rejects.toThrow(
      new NotFoundException(MESSAGES.exception.user.NotFound),
    );
  });

  // Teste para findAll
  it('should return an array of Task Entities on findAll', async () => {
    // Act
    const result = await controller.findAll();
    // Assert
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(TaskEntity);
  });

  // Teste para findOne
  it('should return a Task Entity on findOne', async () => {
    // Arrange
    const taskId = '1';
    // Act
    const result = await controller.findOne(taskId);
    // Assert
    expect(result).toBeInstanceOf(TaskEntity);
    expect(result.id).toBe(1);
  });

  it('should update a task and return void', async () => {
    // Arrange
    const taskId = '1';
    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Task',
      description: 'Updated Description',
      completed: false, // Adicione essa linha
    };
    // Act
    const result = await controller.update(taskId, updateTaskDto);
    // Assert
    expect(result).toBeUndefined();
    expect(service.update).toHaveBeenCalledWith(+taskId, updateTaskDto);
  });

  // Teste para remove
  it('should remove a task and return void', async () => {
    // Arrange
    const taskId = '1';
    // Act
    const result = await controller.remove(taskId);
    // Assert
    expect(result).toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(+taskId);
  });

  // Teste para findAll com retorno vazio
  it('should return an empty array when no tasks are found', async () => {
    // Arrange
    jest.spyOn(service, 'findAll').mockResolvedValueOnce([]);

    // Act
    const result = await controller.findAll();

    // Assert
    expect(result).toEqual([]);
    expect(service.findAll).toHaveBeenCalled();
  });

  // Teste para update com NotFoundException
  it('should throw NotFoundException when updating a non-existing task', async () => {
    // Arrange
    const taskId = '999';
    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Task',
      description: 'Updated Description',
      completed: false,
    };

    jest
      .spyOn(service, 'update')
      .mockRejectedValueOnce(new NotFoundException());

    // Act & Assert
    await expect(controller.update(taskId, updateTaskDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  // Teste para remove com NotFoundException
  it('should throw NotFoundException when removing a non-existing task', async () => {
    // Arrange
    const taskId = '999';

    jest
      .spyOn(service, 'remove')
      .mockRejectedValueOnce(new NotFoundException());

    // Act & Assert
    await expect(controller.remove(taskId)).rejects.toThrow(NotFoundException);
  });
});
