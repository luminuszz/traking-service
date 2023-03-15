import {
  DeliveryServiceProvider,
  DeliveryTraking,
  TrakingWithStatus,
} from '@app/contracts/traking-finder.provider';
import { Injectable } from '@nestjs/common';

import { rastrearEncomendas } from 'correios-brasil';
import { compareDesc, parseISO } from 'date-fns';
import { CorreiosExceptionFilter } from './correios-service.filter';

type TrakingOrderResponseDto = {
  eventos: {
    dtHrCriado: string;
    descricao: string;
    unidade: {
      endereco: {
        cidade: string;
        uf: string;
      };
    };
  }[];
};

@Injectable()
export class CorreiosDeliveryProviderService implements DeliveryServiceProvider {
  async getMoreRecentTrakingOrder(traking_code: string): Promise<TrakingWithStatus | null> {
    try {
      const [response] = (await rastrearEncomendas([traking_code])) as TrakingOrderResponseDto[];

      if (!response?.eventos?.length) return null;

      const [traking] = response.eventos?.sort((a, b) =>
        compareDesc(parseISO(a.dtHrCriado), parseISO(b.dtHrCriado)),
      );

      const message = `${traking.descricao}
      ${traking.unidade?.endereco?.cidade || ''} - ${traking?.unidade?.endereco?.uf || ''}
    `;

      return {
        traking: {
          message,
          date: parseISO(traking.dtHrCriado),
        },

        isDelivered: traking.descricao === 'Objeto entregue ao destinatário',
      };
    } catch (e) {
      if (e instanceof Error) {
        throw new CorreiosExceptionFilter(e.message);
      }
    }
  }

  async getAllTrakingByTrakingCode(traking_code: string): Promise<DeliveryTraking[]> {
    try {
      const [response] = await rastrearEncomendas([traking_code]);

      return (
        response?.eventos?.map((traking) => ({
          message: traking.descricao,
          date: parseISO(traking.dtHrCriado),
        })) || []
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new CorreiosExceptionFilter(e.message);
      }

      throw e;
    }
  }
}
