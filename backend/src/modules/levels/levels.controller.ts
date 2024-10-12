import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { LevelsService } from './levels.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';

// Entity
import { LevelEntity } from './entities/level.entity';

@ApiTags('levels')
@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @ApiResponse({ type: LevelEntity })
  @Post()
  async create(@Body() createLevelDto: CreateLevelDto): Promise<LevelEntity> {
    const level = await this.levelsService.create(createLevelDto);
    return new LevelEntity(level);
  }

  @ApiResponse({ type: LevelEntity, isArray: true })
  @Get()
  async findAll(): Promise<LevelEntity[]> {
    const levels = await this.levelsService.findAll();
    return levels.map((level) => new LevelEntity(level));
  }

  @Patch(':id')
  @HttpCode(204)
  async update(
    @Param('id') id: string,
    @Body() updateLevelDto: UpdateLevelDto,
  ): Promise<void> {
    await this.levelsService.update(+id, updateLevelDto);
    return;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    await this.levelsService.remove(+id);
    return;
  }
}
