import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';
import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../contracts/order.repository';
import { OrderAlreadyExistsError } from '@app/services/errors/order-already-exists.error';
import { DeliveryServiceProvider } from '@app/contracts/traking-finder.provider';
import { TrakingService } from '@app/services/traking.service';
import { isAfter } from 'date-fns';
import { Traking } from '@app/entities/traking.entity';
import { MessagingService } from '@app/contracts/messaging.service';
import { OrderNotFoundError } from '@app/services/errors/order-not-found.error';
import { NewTrakingCreatedEvent } from '@app/events/new-traking-created.event';

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

    const order = Order.create({
      recipient_id,
      traking_code,
      updated_at: null,
      created_at: new Date(),
      isDelivered: false,
      name,
    });

    await this.orderRepository.save(order);

    const hasTrakings =
      await this.deliveryServiceProvider.getAllTrakingByTrakingCode(
        order.traking_code,
      );

    if (hasTrakings.length) {
      const trakings = hasTrakings.map((traking) =>
        Traking.create({
          order_id: order.id,
          recipient_traking_created_at: traking.date,
          message: traking.message,
        }),
      );

      await this.trakingService.createManyTraking(trakings);
    }
  }

  public async refreshOrderTraking(order_id: string): Promise<void> {
    const order = await this.orderRepository.findOrderById(order_id);

    if (!order) throw new OrderNotFoundError();

    const lastTrakingRegistredByDeliveryProvider =
      await this.deliveryServiceProvider.getMoreRecentTrakingOrder(
        order.traking_code,
      );

    if (!lastTrakingRegistredByDeliveryProvider) return;

    const lastTrakingRegistredByOrderId =
      await this.trakingService.findMoreRecentTrakingByOrderId(order.id);

    const { traking, isDelivered } = lastTrakingRegistredByDeliveryProvider;

    if (lastTrakingRegistredByOrderId) {
      const isNewTraking = isAfter(
        lastTrakingRegistredByDeliveryProvider.traking.date,
        lastTrakingRegistredByOrderId.recipient_traking_created_at,
      );

      if (isNewTraking) {
        await this.trakingService.createTraking({
          order_id,
          message: traking.message,
          recipient_traking_created_at: traking.date,
        });

        this.messagingService.dispatch(
          new NewTrakingCreatedEvent({
            date: traking.date,
            message: traking.message,
            recipient_id: order.recipient_id,
            traking_code: order.traking_code,
            name: order?.name,
          }),
        );

        if (isDelivered) {
          await this.orderRepository.updateOrder(order_id, {
            isDelivered: true,
          });
        }
      }

      return;
    }

    await this.trakingService.createTraking({
      order_id,
      message: traking.message,
      recipient_traking_created_at: traking.date,
    });

    this.messagingService.dispatch(
      new NewTrakingCreatedEvent({
        date: traking.date,
        message: traking.message,
        recipient_id: order.recipient_id,
        traking_code: order.traking_code,
        name: order?.name,
      }),
    );

    if (isDelivered) {
      await this.orderRepository.updateOrder(order_id, {
        isDelivered: true,
      });
    }
  }

  public async findOrderById(order_id: string): Promise<Order | undefined> {
    return this.orderRepository.findOrderById(order_id);
  }

  async findAllOrdersThatNotHaveBeenDelivered(): Promise<Order[]> {
    return this.orderRepository.findAllOrdersWithIsDeliveryFalse();
  }

  async findAllOrders(): Promise<Order[]> {
    return this.orderRepository.findAllOrders();
  }
}
