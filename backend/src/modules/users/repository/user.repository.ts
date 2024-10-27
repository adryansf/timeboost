import { PrismaService } from '@/database/prisma.service';
import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';

export interface PaginationParams {
  take: number;
  skip: number;
  where: {
    username?: {
      contains: string;
      mode: 'insensitive' | 'default';
    };
  };
}

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findByUsername(username: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        username,
      },
    });
  }

  async findById(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async findWithPagination({
    take,
    skip,
    where,
  }: PaginationParams): Promise<[number, User[]]> {
    return this.prisma.$transaction([
      this.prisma.user.count({
        where,
      }),
      this.prisma.user.findMany({
        skip,
        take,
        where,
      }),
    ]);
  }

  async create(
    data: Omit<Omit<Omit<User, 'id'>, 'createdAt'>, 'updatedAt'>,
  ): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }
}
