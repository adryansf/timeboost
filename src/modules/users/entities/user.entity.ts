import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { hash, hashSync } from 'bcrypt';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static encryptPassword(password: string) {
    return hashSync(password, Number(process.env.SALTS || 10));
  }
}
