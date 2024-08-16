import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

import { MESSAGES } from '@/common/messages';

export class FindAllUsersDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: MESSAGES.validation.IsInt('page') })
  page?: number = 1;
}
