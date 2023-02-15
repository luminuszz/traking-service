import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { TaskModule } from '@infra/tasks/task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TcpModule } from '@infra/tcp/tcp.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TaskModule,
    TcpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
