import { FindAllUsersDto } from './../../users/dto/find-all-users.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { Task } from '@prisma/client';
import { randomUUID } from 'crypto';

// Services
import { PrismaService } from '@/database/prisma.service';

// Repository
import { TaskRepository } from './task.repository';

describe('TasksRepository', () => {
  let tasks: Task[];
  let repository: TaskRepository;
  let prisma: PrismaService;

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
              create: jest.fn(
                ({ data }: { data: Omit<Omit<Task, 'id'>, 'createdAt'> }) => {
                  const createdTask = {
                    id: tasks[tasks.length - 1].id + 1,
                    ...data,
                    createdAt: new Date(),
                  } as Task;

                  tasks.push(createdTask);
                  return createdTask;
                },
              ),
              findMany: jest.fn(() => tasks),
              findUnique: jest.fn((params: { where: { id: number } }) =>
                tasks.find((task) => task.id === params.where.id),
              ),
              update: jest.fn(
                ({
                  data,
                  where,
                }: {
                  data: Partial<Task>;
                  where: { id: number };
                }) => {
                  const updatedTask = {
                    ...tasks.find((t) => t.id === where.id),
                    ...data,
                  };

                  tasks = tasks.map((t) =>
                    t.id === where.id ? updatedTask : t,
                  );

                  return updatedTask;
                },
              ),
              delete: jest.fn(({ where }: { where: { id: number } }) => {
                const task = tasks.find((t) => t.id === where.id);

                tasks = tasks.filter((t) => t.id !== where.id);

                return task;
              }),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<TaskRepository>(TaskRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(prisma).toBeDefined();
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
    expect(prisma.task.create).toHaveBeenCalledWith({ data: taskToCreate });
    expect(result).toBe(tasks[tasks.length - 1]);
  });

  it('should return all tasks', async () => {
    // Act
    const result = await repository.findAll();
    // Assert
    expect(prisma.task.findMany).toHaveBeenCalled();
    expect(result).toBe(tasks);
  });

  it('should return a task by id', async () => {
    // Act
    const id = 1;
    const result = await repository.findById(id);
    // Assert
    expect(prisma.task.findUnique).toHaveBeenCalledWith({ where: { id } });
    expect(result).toBe(tasks[0]); // Verifica se a tarefa retornada é a que possui o id 1
  });

  it('should update a task by id', async () => {
    // Arrange
    const id = 1;
    const updateData: Partial<Task> = {
      title: 'Updated Task Title',
      description: 'updated description',
      completed: true,
    };
    // Act
    const result = await repository.update(id, updateData);
    // Assert
    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id },
      data: updateData,
    });
    expect(result).toEqual({ ...result, ...updateData }); // Verifica se o título foi atualizado
  });

  it('should delete a task by id', async () => {
    // Act
    const task = tasks[0];
    const id = task.id;
    const result = await repository.delete(id);
    // Assert
    expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id } });
    expect(result).toBe(task); // Verifica se a tarefa deletada é a correta
  });
});
