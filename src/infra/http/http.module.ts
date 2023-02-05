import { Module } from '@nestjs/common';
import { OrderController } from '@infra/http/order.controller';
import { DomainModule } from '@app/domain.module';

@Module({
  imports: [DomainModule],
  controllers: [OrderController],
})
export class HttpModule {}
