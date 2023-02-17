import { Module } from '@nestjs/common';
import { DeliveryServiceProvider } from '@app/contracts/traking-finder.provider';
import { CorreiosDeliveryProviderService } from '@infra/delivery/correios/correios-delivery-provider.service';

@Module({
  providers: [
    {
      provide: DeliveryServiceProvider,
      useClass: CorreiosDeliveryProviderService,
    },
  ],
  exports: [DeliveryServiceProvider],
})
export class DeliveryModule {}
