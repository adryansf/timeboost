import { FindAllUsersDto } from './../../users/dto/find-all-users.dto';
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

  it('should return all tasks', async () => {
    // Act
    const result = await repository.findAll();
    // Assert
    expect(result).toBe(tasks);
    expect(result.length).toBe(1);
  });

  it('should return a task by id', async () => {
    // Act
    const result = await repository.findById(1);
    // Assert
    expect(result).toBe(tasks[0]); // Verifica se a tarefa retornada é a que possui o id 1
  });

  it('should update a task by id', async () => {
    // Arrange
    const updateData: Partial<Task> = { title: 'Updated Task Title' };
    // Act
    const result = await repository.update(1, updateData);
    // Assert
    expect(result.title).toBe(updateData.title); // Verifica se o título foi atualizado
  });

  it('should delete a task by id', async () => {
    // Act
    const result = await repository.delete(1);
    // Assert
    expect(result).toBe(tasks[0]); // Verifica se a tarefa deletada é a correta
    expect(tasks.length).toBe(0); // Verifica se a tarefa foi removida da lista
  });
});
