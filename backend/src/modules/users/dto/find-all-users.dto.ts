import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

import { MESSAGES } from '@/utils/messages';

// Validações
export class FindAllUsersDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: MESSAGES.validation.IsInt('page') })
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: MESSAGES.validation.IsString('username') })
  username?: string;
}
