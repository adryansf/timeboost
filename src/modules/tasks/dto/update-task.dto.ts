import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsBoolean } from 'class-validator';
import { MESSAGES } from '@/utils/messages';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty()
  @IsBoolean({ message: MESSAGES.validation.IsBoolean('completed') })
  completed: boolean;
}
