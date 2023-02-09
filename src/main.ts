import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

(async () => {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'traking-service',

          retry: {
            retries: 5,
            maxRetryTime: 5000,
            multiplier: 2,
          },

          brokers: [process.env.KAFKA_CONECT_URL],
        },

        consumer: {
          groupId: 'traking-service-consumer',
        },
      },
    },
  );
  await app.listen();
})();
