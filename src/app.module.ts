import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { TcpModule } from '@infra/tcp/tcp.module';
import { LoggerInterceptor } from '@infra/utils/logger.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [ConfigModule.forRoot(), TcpModule],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
