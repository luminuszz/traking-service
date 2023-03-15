import { MessagingService } from '@app/contracts/messaging.service';
import { DomainEvent } from '@app/events/event';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaMessagingService extends ClientKafka implements MessagingService {
  public logger = new Logger(KafkaMessagingService.name);

  constructor(private readonly config: ConfigService) {
    super({
      client: {
        clientId: 'traking-service-client',
        brokers: [config.get<string>('KAFKA_CONECT_URL')],
        connectionTimeout: 5000,
        retry: {
          retries: 5,
          multiplier: 2,
          restartOnFailure: async (e) => {
            Logger.error(e);
            return true;
          },
        },
      },

      consumer: {
        groupId: 'traking-service-consumer',
      },
    });
  }

  dispatch(event: DomainEvent<unknown>) {
    this.emit(event.eventName, event.payload);
  }
}
