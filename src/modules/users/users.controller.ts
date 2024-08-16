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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { PaginationUsersDto } from './dto/pagination-users.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ type: UserEntity })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.create(createUserDto));
  }

  @ApiResponse({ type: PaginationUsersDto })
  @Get()
  async findAll(@Query() findAllUsers: FindAllUsersDto) {
    return new PaginationUsersDto(
      await this.usersService.findAll(findAllUsers),
    );
  }

  @ApiResponse({ type: UserEntity })
  @Get(':username')
  async findOne(@Param('username') username: string) {
    return new UserEntity(await this.usersService.findOne(username));
  }

  @Patch(':id')
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    await this.usersService.update(id, updateUserDto);
    return;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
