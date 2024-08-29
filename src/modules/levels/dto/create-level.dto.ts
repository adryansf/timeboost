import { IsString, IsInt, IsPositive, MinLength } from 'class-validator';
import { MESSAGES } from '@/utils/messages';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLevelDto {
  @ApiProperty()
  @IsString({ message: MESSAGES.validation.IsString('name') })
  @MinLength(3, { message: MESSAGES.validation.MinLength('name', 3) })
  name: string;

  @ApiProperty()
  @IsInt({ message: MESSAGES.validation.IsInt('pointsRequired') })
  @IsPositive({ message: MESSAGES.validation.IsPositive('pointsRequired') })
  pointsRequired: number;
}
