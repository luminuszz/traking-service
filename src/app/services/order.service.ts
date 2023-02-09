import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';
import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../contracts/order.repository';
import { OrderAlreadyExistsError } from '@app/services/errors/order-already-exists.error';
import { DeliveryServiceProvider } from '@app/contracts/traking-finder.provider';
import { TrakingService } from '@app/services/traking.service';
import { isAfter, parseISO } from 'date-fns';
import { Traking } from '@app/entities/traking.entity';
import { MessagingService } from '@app/contracts/messaging.service';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private readonly deliveryServiceProvider: DeliveryServiceProvider,
    private readonly trakingService: TrakingService,
    private readonly messagingService: MessagingService,
  ) {}

  public async createOrder({
    recipient_id,
    traking_code,
    name,
  }: CreateOrderDto) {
    const orderWithTrakingCodeAlreadyExists =
      await this.orderRepository.findOrderByTrakingCode(traking_code);

    if (orderWithTrakingCodeAlreadyExists) throw new OrderAlreadyExistsError();

    const order = new Order({
      recipient_id,
      traking_code,
      updated_at: null,
      created_at: new Date(),
      isDeliveried: false,
      name,
    });

    await this.orderRepository.save(order);

    const hasTrakings =
      await this.deliveryServiceProvider.getAllTrakingByTrakingCode(
        order.traking_code,
      );

    if (hasTrakings.length) {
      const trakings = hasTrakings.map(
        (traking) =>
          new Traking({
            order_id: order.id,
            recipient_traking_created_at: this.parseDate(traking.date),
            message: traking.message,
          }),
      );

      await this.trakingService.createManyTraking(trakings);
    }
  }

  public async refreshOrderTraking(order_id: string): Promise<void> {
    const order = await this.orderRepository.findOrderById(order_id);

    const { traking, isDelivered } =
      await this.deliveryServiceProvider.getMoreRecentTrakingOrder(
        order.traking_code,
      );

    const moreRecentTraking =
      await this.trakingService.findMoreRecentTrakingByOrderId(order.id);

    if (moreRecentTraking) {
      const isNewTraking = isAfter(
        parseISO(traking.date),
        moreRecentTraking.recipient_traking_created_at,
      );

      if (isNewTraking) {
        this.messagingService.updateOrderStatusTraking({
          date: this.parseDate(traking.date),
          message: traking.message,
          recipient_id: order.recipient_id,
          traking_code: order.traking_code,
          name: order?.name,
        });
      }
    } else {
      await this.trakingService.createTraking({
        order_id,
        message: traking.message,
        recipient_traking_created_at: this.parseDate(traking.date),
      });

      this.messagingService.updateOrderStatusTraking({
        date: this.parseDate(traking.date),
        message: traking.message,
        recipient_id: order.recipient_id,
        traking_code: order.traking_code,
        name: order?.name,
      });
    }

    if (isDelivered) {
      await this.orderRepository.updateOrder(order_id, {
        isDeliveried: true,
      });
    }
  }

  public async findOrderById(order_id: string): Promise<Order | undefined> {
    return this.orderRepository.findOrderById(order_id);
  }

  private parseDate(value: string): Date {
    return parseISO(value);
  }

  async findAllOrdersThatNotHaveBeenDelivered(): Promise<Order[]> {
    return await this.orderRepository.findAllOrdersWithIsDeliveryFalse();
  }
}
