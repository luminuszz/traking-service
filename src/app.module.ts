import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { TaskModule } from '@infra/tasks/task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TcpModule } from '@infra/tcp/tcp.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from '@infra/utils/logger.interceptor';

@Module({
  imports: [ConfigModule.forRoot(), ScheduleModule.forRoot(), TaskModule, TcpModule],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
