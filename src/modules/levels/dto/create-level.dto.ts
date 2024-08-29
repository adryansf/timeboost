import { IsString, IsInt, IsPositive, MinLength } from 'class-validator';
import { MESSAGES } from '@/utils/messages';

export class CreateLevelDto {
  @IsString({ message: MESSAGES.validation.IsString('name') })
  @MinLength(3, { message: MESSAGES.validation.MinLength('name', 3) })
  name: string;

  @IsInt({ message: MESSAGES.validation.IsInt('pointsRequired') })
  @IsPositive({ message: MESSAGES.validation.IsPositive('pointsRequired') })
  pointsRequired: number;
}
