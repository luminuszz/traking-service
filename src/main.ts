import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionInterceptor } from '@infra/errors/http-exception.interceptor';

(async () => {
  const logger = new Logger('MainInstance');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ stopAtFirstError: true, transform: true }),
  );
  app.useGlobalInterceptors(new HttpExceptionInterceptor());

  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'traking-service-client',
        retry: {
          retries: 2,
        },

        brokers: [configService.get('KAFKA_CONECT_URL')],
      },

      consumer: {
        groupId: 'traking-service-consumer',
      },
    },
  });

  app.startAllMicroservices().then(() => logger.log('Microservices started'));
  app.listen(3003).then(() => logger.log('http Server started'));
})();
