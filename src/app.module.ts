import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { LevelsModule } from './modules/levels/levels.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [UsersModule, TasksModule, LevelsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
