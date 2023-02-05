import {
  TrakingFinderProvider,
  TrakingWithStatus,
} from '@app/contracts/traking-finder.provider';
import { Injectable } from '@nestjs/common';

import * as correiosBrasil from 'correios-brasil';

@Injectable()
export class CorreiosTrakingProviderService implements TrakingFinderProvider {
  private readonly correiosBrasilProvider = correiosBrasil;

  async getTrakingOrderStatus(
    traking_code: string,
  ): Promise<TrakingWithStatus> {
    const response = await this.correiosBrasilProvider.rastrearEncomendas([
      traking_code,
    ]);

    const traking = response[0];

    return {
      traking: {
        message: traking.descricao,
        date: traking.dtHrCriado,
      },

      isDelivered: traking.descricao === 'Objeto entregue ao destinatário',
    };
  }
}
