import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsUUID } from 'class-validator';

// MESSAGES
import { MESSAGES } from '@/utils/messages';

export class CreateTaskDto {
  @ApiProperty()
  @IsString({ message: MESSAGES.validation.IsString('title') })
  title: string;

  @ApiProperty()
  @IsString({ message: MESSAGES.validation.IsString('title') })
  description: string;

  @ApiProperty()
  @IsDateString({}, { message: MESSAGES.validation.IsDate('dueDate') })
  dueDate: Date;

  @ApiProperty()
  @IsUUID('all', { message: MESSAGES.validation.IsUUID('idUser') })
  idUser: string;
}
