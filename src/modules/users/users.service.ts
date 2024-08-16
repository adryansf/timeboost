import { Injectable, NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

// Dtos
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';

// Services
import { PrismaService } from '@/database/prisma.service';

// Messages
import { MESSAGES } from '@/common/messages';

// Entities
import { UserEntity } from './entities/user.entity';

// Configs
import { PAGINATION } from '@/config/pagination';

// Interfaces
import { IConstructorPaginationUsersDto } from './dto/pagination-users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    // Verify if email is unique
    const existsEmail = await this.prisma.user.findFirst({
      where: {
        email: createUserDto.email,
      },
    });

    if (existsEmail)
      throw new BadRequestException(
        MESSAGES.exception.user.BadRequest.EmailNotUnique,
      );

    // Verify if username is unique
    const existsUsername = await this.prisma.user.findFirst({
      where: {
        username: createUserDto.username,
      },
    });

    if (existsUsername)
      throw new BadRequestException(
        MESSAGES.exception.user.BadRequest.UsernameNotUnique,
      );

    // Create User
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: UserEntity.encryptPassword(createUserDto.password),
      },
    });

    return user;
  }

  async findAll(queryDto: FindAllUsersDto) {
    const { page = 1 } = queryDto;

    const [count, users] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        skip: PAGINATION.users * (page - 1),
        take: PAGINATION.users,
      }),
    ]);

    return { totalUsers: count, users, page } as IConstructorPaginationUsersDto;
  }

  async findOne(username: string): Promise<UserEntity> {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) throw new NotFoundException(MESSAGES.exception.user.NotFound);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException(MESSAGES.exception.user.NotFound);

    // Encriptar Senha
    if (updateUserDto.password) {
      updateUserDto.password = UserEntity.encryptPassword(
        updateUserDto.password,
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });

    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException(MESSAGES.exception.user.NotFound);

    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return;
  }
}
