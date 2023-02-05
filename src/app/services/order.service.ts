import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';
import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../contracts/order.repository';
import { OrderAlreadyExistsError } from '@app/services/errors/order-already-exists.error';
import { DeliveryServiceProvider } from '@app/contracts/traking-finder.provider';
import { TrakingService } from '@app/services/traking.service';
import { isAfter } from 'date-fns';
import { Traking } from '@app/entities/traking.entity';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private readonly deliveryServiceProvider: DeliveryServiceProvider,
    private readonly trakingService: TrakingService,
  ) {}

  public async createOrder({ recipient_id, traking_code }: CreateOrderDto) {
    const orderWithTrakingCodeAlreadyExists =
      await this.orderRepository.findOrderByTrakingCode(traking_code);

    if (orderWithTrakingCodeAlreadyExists) throw new OrderAlreadyExistsError();

    const order = new Order({
      recipient_id,
      traking_code,
      updated_at: null,
      created_at: new Date(),
      isDeliveried: false,
    });

    const hasTrakings =
      await this.deliveryServiceProvider.getAllTrakingByTrakingCode(
        order.traking_code,
      );

    await this.orderRepository.save(order);

    if (hasTrakings.length) {
      const trakings = hasTrakings.map(
        (traking) =>
          new Traking({
            order_id: order.id,
            recipient_traking_created_at: traking.date,
            message: traking.message,
          }),
      );

      await this.trakingService.createManyTraking(trakings);
    }
  }

  public async findOrderById(order_id: string): Promise<Order | undefined> {
    return this.orderRepository.findOrderById(order_id);
  }

  public async refreshOrderTraking(order_id: string): Promise<void> {
    const { traking_code } = await this.orderRepository.findOrderById(order_id);

    const { traking, isDelivered } =
      await this.deliveryServiceProvider.getMoreRecentTrakingOrder(
        traking_code,
      );

    const moreRecentTraking =
      await this.trakingService.findMoreRecentTrakingByOrderId(order_id);

    console.log({
      moreRecentTraking,
    });

    if (moreRecentTraking) {
      const isNewTraking = isAfter(
        new Date(moreRecentTraking.recipient_traking_created_at),
        new Date(traking.date),
      );

      if (isNewTraking) {
        await this.trakingService.createTraking({
          order_id,
          message: traking.message,
          recipient_traking_created_at: traking.date,
        });
      }
    } else {
      await this.trakingService.createTraking({
        order_id,
        message: traking.message,
        recipient_traking_created_at: traking.date,
      });
    }

    if (isDelivered) {
      await this.orderRepository.updateOrder(order_id, {
        isDeliveried: true,
      });
    }
  }
}
