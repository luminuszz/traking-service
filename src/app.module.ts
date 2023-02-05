import { Module } from '@nestjs/common';

import { HttpModule } from '@infra/http/http.module';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from '@infra/tasks/task.module';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, TaskModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
