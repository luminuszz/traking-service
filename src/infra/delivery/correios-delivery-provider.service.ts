import {
  DeliveryServiceProvider,
  DeliveryTraking,
  TrakingWithStatus,
} from '@app/contracts/traking-finder.provider';
import { Injectable } from '@nestjs/common';

import * as correiosBrasil from 'correios-brasil';
import { compareDesc, parseISO } from 'date-fns';

@Injectable()
export class CorreiosDeliveryProviderService
  implements DeliveryServiceProvider
{
  private readonly correiosBrasilProvider = correiosBrasil;

  async getMoreRecentTrakingOrder(
    traking_code: string,
  ): Promise<TrakingWithStatus> {
    const [response] = await this.correiosBrasilProvider.rastrearEncomendas([
      traking_code,
    ]);

    const [traking] = response.eventos?.sort((a, b) =>
      compareDesc(parseISO(a.dtHrCriado), parseISO(b.dtHrCriado)),
    );

    const message = `
        ${traking.descricao}
        ${traking.unidade?.endereco?.cidade || ''} - ${
      traking?.unidade?.endereco?.uf || ''
    }
    `;

    return {
      traking: {
        message,
        date: traking.dtHrCriado,
      },

      isDelivered: traking.descricao === 'Objeto entregue ao destinatário',
    };
  }

  async getAllTrakingByTrakingCode(
    traking_code: string,
  ): Promise<DeliveryTraking[]> {
    const [response] = await this.correiosBrasilProvider.rastrearEncomendas([
      traking_code,
    ]);

    return (
      response?.eventos?.map((traking) => ({
        message: traking.descricao,
        date: traking.dtHrCriado,
      })) || []
    );
  }
}
