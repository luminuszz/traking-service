import { Module } from '@nestjs/common';
import { OrderController } from '@infra/http/order.controller';
import { PrismaModule } from '@infra/database/prisma/prisma.module';
import { OrderService } from '@app/services/order.service';
import { TrakingModule } from '@infra/traking/traking.module';
import { TrakingService } from '@app/services/traking.service';

@Module({
  imports: [PrismaModule, TrakingModule],
  providers: [OrderService, TrakingService],
  controllers: [OrderController],
})
export class HttpModule {}
