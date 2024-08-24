import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

// Dtos
import { CreateTaskDto } from './dto/create-task.dto';

// Entities
import { TaskEntity } from './entities/task.entity';

// Messages
import { MESSAGES } from '@/utils/messages';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
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
});
