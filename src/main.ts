import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

(async () => {
  const mechanism = 'AWS_MSK_IAM' as any;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      consumer: {
        groupId: 'traking-service-consumer',
        allowAutoTopicCreation: true,
      },

      client: {
        clientId: 'traking-service',
        brokers: [process.env.KAFKA_CONNECT_URL],

        retry: {
          retries: 5,
          maxRetryTime: 5000,
          multiplier: 2,
        },

        ssl: true,
        sasl: {
          username: process.env.KAFKA_USERNAME,
          password: process.env.KAFKA_PASSWORD,
          mechanism: 'plain',
        },
        reauthenticationThreshold: 45000,
      },
      producer: {
        allowAutoTopicCreation: false,
      },
    },
  });
  await app.listen();
})();
