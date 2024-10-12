import { Injectable } from '@nestjs/common';
import { Level } from '@prisma/client';

// Services
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class LevelRepository {
  constructor(private prisma: PrismaService) {}

  create(data: Omit<Level, 'id'>): Promise<Level> {
    return this.prisma.level.create({
      data,
    });
  }

  findAll(): Promise<Level[]> {
    return this.prisma.level.findMany();
  }

  findById(id: number): Promise<Level> {
    return this.prisma.level.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, data: Partial<Omit<Level, 'id'>>): Promise<Level> {
    return this.prisma.level.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(id: number): Promise<Level> {
    return this.prisma.level.delete({
      where: {
        id,
      },
    });
  }
}
