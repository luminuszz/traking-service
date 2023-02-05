import { Module } from '@nestjs/common';
import { DeliveryServiceProvider } from '@app/contracts/traking-finder.provider';
import { CorreiosDeliveryProviderService } from '@infra/traking/correios-delivery-provider.service';

@Module({
  providers: [
    {
      provide: DeliveryServiceProvider,
      useClass: CorreiosDeliveryProviderService,
    },
  ],
  exports: [DeliveryServiceProvider],
})
export class TrakingModule {}
