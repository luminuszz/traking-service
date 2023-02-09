import {
  Order as PrismaOrder,
  Traking as PrismaTrakings,
} from '@prisma/client';
import { Order } from '@app/entities/order.entity';
import { Traking } from '@app/entities/traking.entity';

export class PrismaOrderMapper {
  static toDomain(
    prismaOrder: PrismaOrder,
    trakings?: PrismaTrakings[],
  ): Order {
    const domainOrder = new Order(
      {
        isDeliveried: prismaOrder.isDelivered,
        created_at: prismaOrder.createdAt,
        traking_code: prismaOrder.traking_id,
        updated_at: prismaOrder.updatedAt,
        recipient_id: prismaOrder.recipient_id,
        name: prismaOrder?.name,
      },
      prismaOrder.id,
    );

    if (trakings) {
      domainOrder.trakings = trakings.map<Traking>(
        (traking) =>
          new Traking(
            {
              order_id: traking.order_id,
              message: traking.message,
              recipient_traking_created_at:
                traking.recipient_traking_created_at,
            },
            traking.id,
          ),
      );
    }

    return domainOrder;
  }

  static toPrisma(order: Order): PrismaOrder {
    return {
      id: order.id,
      updatedAt: order.updated_at,
      createdAt: order.created_at,
      traking_id: order.traking_code,
      isDelivered: order.isDeliveried,
      recipient_id: order.recipient_id,
      name: order?.name,
    } satisfies PrismaOrder;
  }
}
