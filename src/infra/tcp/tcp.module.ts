import { Module } from '@nestjs/common';
import { OrderController } from '@infra/tcp/order.controller';
import { DomainModule } from '@app/domain.module';
import { MessagingModule } from '@infra/messaging/messaging.module';

@Module({
  imports: [DomainModule, MessagingModule],
  controllers: [OrderController],
})
export class TcpModule {}
