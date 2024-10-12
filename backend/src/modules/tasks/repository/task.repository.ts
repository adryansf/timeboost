import { Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class TaskRepository {
  constructor(private prisma: PrismaService) {}

  create(data: Omit<Omit<Task, 'id'>, 'createdAt'>): Promise<Task> {
    return this.prisma.task.create({
      data,
    });
  }

  findAll(): Promise<Task[]> {
    return this.prisma.task.findMany();
  }

  findById(id: number): Promise<Task> {
    return this.prisma.task.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, data: Partial<Task>): Promise<Task> {
    return this.prisma.task.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(id: number): Promise<Task> {
    return this.prisma.task.delete({
      where: {
        id,
      },
    });
  }
}
