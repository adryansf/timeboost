import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

// Service
import { UsersService } from './users.service';

// Dto
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { PaginationUsersDto } from './dto/pagination-users.dto';

// Handlers
import { serviceExceptionHandler } from '@/common/handlers/exceptions/service';

// Entity
import { UserEntity } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ type: UserEntity })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return new UserEntity(user);
    } catch (err) {
      serviceExceptionHandler(err);
    }
  }

  @ApiResponse({ type: PaginationUsersDto })
  @Get()
  async findAll(@Query() findAllUsersDto: FindAllUsersDto) {
    findAllUsersDto.page = findAllUsersDto?.page || 1;

    return new PaginationUsersDto(
      await this.usersService.findAll(findAllUsersDto),
    );
  }

  @ApiResponse({ type: UserEntity })
  @Get(':username')
  async findOne(@Param('username') username: string) {
    try {
      const user = await this.usersService.findOne(username);
      return new UserEntity(user);
    } catch (err) {
      serviceExceptionHandler(err);
    }
  }

  @Patch(':id')
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      await this.usersService.update(id, updateUserDto);
    } catch (err) {
      serviceExceptionHandler(err);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    try {
      await this.usersService.remove(id);
      return;
    } catch (err) {
      serviceExceptionHandler(err);
    }
  }
}
