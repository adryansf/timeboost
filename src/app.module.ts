import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [UsersModule, TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
