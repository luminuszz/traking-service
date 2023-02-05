import { Module } from '@nestjs/common';
import { TrakingFinderProvider } from '@app/contracts/traking-finder.provider';
import { CorreiosTrakingProviderService } from '@infra/traking/correios-traking-provider.service';

@Module({
  providers: [
    {
      provide: TrakingFinderProvider,
      useClass: CorreiosTrakingProviderService,
    },
  ],
  exports: [TrakingFinderProvider],
})
export class TrakingModule {}
