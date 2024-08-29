import { Module } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { LevelsController } from './levels.controller';
import { LevelRepository } from './repository/level.repository';
import { PrismaService } from '@/database/prisma.service';

@Module({
  controllers: [LevelsController],
  providers: [LevelsService, PrismaService, LevelRepository],
})
export class LevelsModule {}
