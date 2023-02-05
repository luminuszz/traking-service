import { Traking } from '@app/entities/traking.entity';

import { Traking as PrismaTraking } from '@prisma/client';

export class PrismaTrakingMapper {
  static toPrisma(traking: Traking): PrismaTraking {
    return {
      message: traking.message,
      recipient_traking_created_at: traking.recipient_traking_created_at,
      order_id: traking.order_id,
      id: traking.id,
    };
  }

  static toDomain(traking: PrismaTraking): Traking {
    return new Traking(
      {
        message: traking.message,
        recipient_traking_created_at: traking.recipient_traking_created_at,
        order_id: traking.order_id,
      },
      traking.id,
    );
  }
}
