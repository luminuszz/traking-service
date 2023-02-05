import { Module } from '@nestjs/common';
import { OrderService } from '@app/services/order.service';
import { TrakingService } from '@app/services/traking.service';
import { PrismaModule } from '@infra/database/prisma/prisma.module';
import { MessagingModule } from '@infra/messaging/messaging.module';
import { DeliveryModule } from '@infra/delivery/delivery.module';

@Module({
  imports: [PrismaModule, MessagingModule, DeliveryModule],
  providers: [OrderService, TrakingService],
  exports: [OrderService, TrakingService],
})
export class DomainModule {}
