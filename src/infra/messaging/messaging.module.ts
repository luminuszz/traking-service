import { Module } from '@nestjs/common';
import { MessagingService } from '@app/contracts/messaging.service';
import { KafkaMessagingService } from '@infra/messaging/kafka-messaging.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],

  providers: [
    {
      provide: MessagingService,
      useClass: KafkaMessagingService,
    },
  ],
  exports: [MessagingService],
})
export class MessagingModule {}
