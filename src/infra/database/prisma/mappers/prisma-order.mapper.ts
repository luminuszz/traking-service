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
      },
      prismaOrder.id,
    );

    if (trakings) {
      domainOrder.trakings = trakings.map<Traking>(
        (traking) =>
          new Traking(
            { order_id: traking.order_id, message: traking.message },
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
    } satisfies PrismaOrder;
  }
}
