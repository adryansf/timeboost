import { Level } from 'prisma/prisma-client';
import { ApiProperty } from '@nestjs/swagger';

export class LevelEntity implements Level {
  constructor(partial: Partial<Level>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  pointsRequired: number;
}
