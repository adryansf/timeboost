import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

// Dtos
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';

// Services
import { UserRepository } from './repository/user.repository';

// Messages
import { MESSAGES } from '@/utils/messages';

// Entities
import { UserEntity } from './entities/user.entity';

// Configs
import { PAGINATION } from '@/config/pagination';

// Interfaces
import { IConstructorPaginationUsersDto } from './dto/pagination-users.dto';

@Injectable()
export class UsersService {
  constructor(private repository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    // Verify if email is unique
    const existsEmail = await this.repository.findByEmail(createUserDto.email);

    if (existsEmail)
      throw new BadRequestException(
        MESSAGES.exception.user.BadRequest.EmailNotUnique,
      );

    // Verify if username is unique
    const existsUsername = await this.repository.findByUsername(
      createUserDto.username,
    );

    if (existsUsername)
      throw new BadRequestException(
        MESSAGES.exception.user.BadRequest.UsernameNotUnique,
      );

    // Create User
    const user = await this.repository.create({
      ...createUserDto,
      password: UserEntity.encryptPassword(createUserDto.password),
      idLevel: 1,
    });

    return user;
  }

  async findAll(queryDto: FindAllUsersDto) {
    const { page = 1 } = queryDto;

    const [count, users] = await this.repository.findWithPagination({
      skip: PAGINATION.users * (page - 1),
      take: PAGINATION.users,
    });

    return { totalUsers: count, users, page } as IConstructorPaginationUsersDto;
  }

  async findOne(username: string): Promise<UserEntity> {
    const user = await this.repository.findByUsername(username);

    if (!user) throw new NotFoundException(MESSAGES.exception.user.NotFound);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.repository.findById(id);

    if (!user) throw new NotFoundException(MESSAGES.exception.user.NotFound);

    // Encriptar Senha
    if (updateUserDto.password) {
      updateUserDto.password = UserEntity.encryptPassword(
        updateUserDto.password,
      );
    }

    const updatedUser = await this.repository.update(id, updateUserDto);

    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.repository.findById(id);

    if (!user) throw new NotFoundException(MESSAGES.exception.user.NotFound);

    return this.repository.delete(id);
  }
}
