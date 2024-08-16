import { ApiProperty } from '@nestjs/swagger';

// Entity
import { UserEntity } from '../entities/user.entity';

// Configs
import { PAGINATION } from '@/config/pagination';

export interface IConstructorPaginationUsersDto {
  users: UserEntity[];
  totalUsers: number;
  page: number;
}

export class PaginationUsersDto {
  constructor({ users, totalUsers, page }: IConstructorPaginationUsersDto) {
    this.users = users;
    this.usersInPage = users.length;
    this.totalUsers = totalUsers;
    this.totalPages = Math.ceil(totalUsers / PAGINATION.users);
    this.page = page;
  }

  @ApiProperty({ isArray: true, type: UserEntity })
  users: UserEntity[];

  @ApiProperty()
  usersInPage: number;

  @ApiProperty()
  totalUsers: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;
}
