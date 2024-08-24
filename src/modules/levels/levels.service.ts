import { Injectable, NotFoundException } from '@nestjs/common';
import { Level } from '@prisma/client';

// Dtos
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';

// Repository
import { LevelRepository } from './repository/level.repository';

// MESSAGES
import { MESSAGES } from '@/utils/messages';

@Injectable()
export class LevelsService {
  constructor(private repository: LevelRepository) {}

  create(createLevelDto: CreateLevelDto): Promise<Level> {
    return this.repository.create(createLevelDto);
  }

  findAll(): Promise<Level[]> {
    return this.repository.findAll();
  }

  async update(id: number, updateLevelDto: UpdateLevelDto): Promise<Level> {
    const level = await this.repository.findById(id);

    if (!level) throw new NotFoundException(MESSAGES.exception.level.NotFound);

    return this.repository.update(id, updateLevelDto);
  }

  async remove(id: number): Promise<Level> {
    const level = await this.repository.findById(id);

    if (!level) throw new NotFoundException(MESSAGES.exception.level.NotFound);

    return this.repository.delete(id);
  }
}
