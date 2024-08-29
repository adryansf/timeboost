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
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

// Service
import { UsersService } from './users.service';

// Dto
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { PaginationUsersDto } from './dto/pagination-users.dto';

// Entity
import { UserEntity } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ type: UserEntity })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return new UserEntity(user);
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
    const user = await this.usersService.findOne(username);
    return new UserEntity(user);
  }

  @Patch(':id')
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    await this.usersService.update(id, updateUserDto);
    return;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return;
  }
}
