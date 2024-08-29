import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskRepository } from './repository/task.repository';
import { PrismaService } from '@/database/prisma.service';
import { UserRepository } from '../users/repository/user.repository';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TaskRepository, PrismaService, UserRepository],
})
export class TasksModule {}
