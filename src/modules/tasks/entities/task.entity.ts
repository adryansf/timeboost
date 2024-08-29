import { Task } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class TaskEntity implements Task {
  @ApiProperty()
  id: number;

  @ApiProperty()
  idUser: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty()
  completed: boolean;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  constructor(partial: Partial<Task>) {
    Object.assign(this, partial);
  }
}
