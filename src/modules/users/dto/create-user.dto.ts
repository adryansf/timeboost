import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { MESSAGES } from '@/utils/messages';

// Validações
export class CreateUserDto {
  @ApiProperty({ uniqueItems: true })
  @IsEmail({}, { message: MESSAGES.validation.IsEmail('email') })
  email: string;

  @ApiProperty({ minLength: 3, uniqueItems: true })
  @IsString({
    message: MESSAGES.validation.IsString('username'),
  })
  @MinLength(3, { message: MESSAGES.validation.MinLength('username', 3) })
  username: string;

  @ApiProperty({ minLength: 8 })
  @IsString({
    message: MESSAGES.validation.IsString('password'),
  })
  @MinLength(8, { message: MESSAGES.validation.MinLength('password', 8) })
  password: string;
}
