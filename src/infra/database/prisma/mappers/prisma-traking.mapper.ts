import { Traking } from '@app/entities/traking.entity';

import { Traking as PrismaTraking } from '@prisma/client';

export class PrismaTrakingMapper {
  static toPrisma(traking: Traking): PrismaTraking {
    return {
      message: traking.message,
      recipient_traking_created_at: traking.recipient_traking_created_at,
      order_id: traking.order_id,
      id: traking.id,
      description: traking.description ?? '',
    };
  }

  static toDomain(traking: PrismaTraking): Traking {
    return Traking.create(
      {
        message: traking.message,
        recipient_traking_created_at: traking.recipient_traking_created_at,
        order_id: traking.order_id,
        description: traking.description ?? null,
      },
      traking.id,
    );
  }
}
