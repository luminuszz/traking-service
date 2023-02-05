import { Injectable } from '@nestjs/common';
import { OrderRepository } from '@app/contracts/order.repository';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { Order } from '@app/entities/order.entity';
import { PrismaOrderMapper } from '@infra/database/prisma/mappers/prisma-order.mapper';

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findOrderByTrakingCode(
    traking_code: string,
  ): Promise<Order | undefined> {
    const order = await this.prismaService.order.findUnique({
      where: {
        traking_id: traking_code,
      },
    });

    return order ? PrismaOrderMapper.toDomain(order) : null;
  }

  async save(order: Order): Promise<void> {
    await this.prismaService.order.create({
      data: {
        id: order.id,
        isDelivered: order.isDeliveried,
        createdAt: order.created_at,
        traking_id: order.traking_code,
        recipient_id: order.recipient_id,
      },
    });
  }

  async findOrderById(order_id: string): Promise<Order | undefined> {
    const order = await this.prismaService.order.findUnique({
      where: {
        id: order_id,
      },
      include: {
        trakings: true,
      },
    });

    return order ? PrismaOrderMapper.toDomain(order, order.trakings) : null;
  }

  async updateOrder(order_id: string, order: Partial<Order>): Promise<void> {
    await this.prismaService.order.update({
      where: {
        id: order_id,
      },
      data: {
        isDelivered: order?.isDeliveried,
        recipient_id: order?.recipient_id,
        updatedAt: order?.updated_at,
        createdAt: order?.created_at,
        traking_id: order?.traking_code,
      },
    });
  }

  async findAllOrdersWithIsDeliveryFalse(): Promise<Order[]> {
    const orders = await this.prismaService.order.findMany({
      where: {
        isDelivered: false,
      },
    });

    return orders.map((order) => PrismaOrderMapper.toDomain(order));
  }
}
