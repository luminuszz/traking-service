import { Module } from '@nestjs/common';

import { HttpModule } from '@infra/http/http.module';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from '@infra/tasks/task.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    TaskModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
