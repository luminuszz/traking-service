import { Module } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { PrismaOrderRepository } from '@infra/database/prisma/repositories/prisma-order.repository';
import { OrderRepository } from '@app/contracts/order.repository';
import { TrakingRepository } from '@app/contracts/traking.repository';
import { PrismaTrakingRepository } from '@infra/database/prisma/repositories/prisma-traking.repository';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaErrorInterceptor } from '@infra/database/prisma/prisma-error.interceptor';

@Module({
  providers: [
    PrismaService,
    {
      provide: OrderRepository,
      useClass: PrismaOrderRepository,
    },
    {
      provide: TrakingRepository,
      useClass: PrismaTrakingRepository,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PrismaErrorInterceptor,
    },
  ],
  exports: [PrismaService, OrderRepository, TrakingRepository],
})
export class PrismaModule {}
