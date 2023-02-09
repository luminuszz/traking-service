import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { ValidationPipe } from '@nestjs/common';

(async () => {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'traking-service-client',
          retry: {
            retries: 2,
          },

          brokers: [process.env.KAFKA_CONECT_URL],
        },

        consumer: {
          groupId: 'traking-service-consumer',
        },
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({ stopAtFirstError: true, transform: true }),
  );

  await app.listen();
})();
