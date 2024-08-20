import { PrismaService } from '@/database/prisma.service';
import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';

// Dtos
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface IUserRepository {
  findByUsername: (username: string) => Promise<User>;
  findById: (id: string) => Promise<User>;
  findByEmail: (email: string) => Promise<User>;
  findWithPagination: (pagination: {
    take: number;
    skip: number;
  }) => Promise<[number, User[]]>;
  create: (createUserDto: CreateUserDto) => Promise<User>;
  update: (id: string, updateUser: UpdateUserDto) => Promise<User>;
  delete: (id: string) => Promise<User>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findByUsername(username: string) {
    return this.prisma.user.findFirst({
      where: {
        username,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async findWithPagination({ take, skip }: { take: number; skip: number }) {
    return this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        skip,
        take,
      }),
    ]);
  }

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: { ...createUserDto, idLevel: 1 },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }
}
