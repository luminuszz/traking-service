import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule);

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
}
bootstrap();
