import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { LevelsModule } from './modules/levels/levels.module';

@Module({
  imports: [UsersModule, LevelsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
