import { MessagingService } from '@app/contracts/messaging.service';
import { DeliveryServiceProvider } from '@app/contracts/traking-finder.provider';
import { OrderCreatedEvent } from '@app/events/order-created.event';
import { TrakingCreatedEvent } from '@app/events/traking-created.event';
import { OrderAlreadyExistsError } from '@app/services/errors/order-already-exists.error';
import { OrderNotFoundError } from '@app/services/errors/order-not-found.error';
import { TrakingService } from '@app/services/traking.service';
import { Injectable } from '@nestjs/common';
import { isAfter } from 'date-fns';
import { OrderRepository } from '../contracts/order.repository';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private readonly deliveryServiceProvider: DeliveryServiceProvider,
    private readonly trakingService: TrakingService,
    private readonly messagingService: MessagingService,
  ) {}

  public async createOrder({ recipient_id, traking_code, name }: CreateOrderDto) {
    const orderWithTrakingCodeAlreadyExists = await this.orderRepository.findOrderByTrakingCode(traking_code);

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

    this.messagingService.dispatch(new OrderCreatedEvent({ order: order }));
  }

  public async refreshOrderTraking(order_id: string): Promise<void> {
    const order = await this.orderRepository.findOrderById(order_id);

    if (!order) throw new OrderNotFoundError();

    const lastTrakingRegistredByDeliveryProvider =
      await this.deliveryServiceProvider.getMoreRecentTrakingOrder(order.traking_code);

    if (!lastTrakingRegistredByDeliveryProvider) return;

    const lastTrakingRegistredByOrderId = await this.trakingService.findMoreRecentTrakingByOrderId(order.id);

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

        if (isDelivered) {
          await this.orderRepository.updateOrder(order_id, {
            isDelivered: true,
          });
        }

        this.messagingService.dispatch(
          new TrakingCreatedEvent({
            message: traking.message,
            date: traking.date,
            name: order.name,
            recipient_id: order.recipient_id,
            traking_code: order.traking_code,
            description: traking.description,
          }),
        );
      }
    } else {
      await this.trakingService.createTraking({
        order_id,
        message: traking.message,
        recipient_traking_created_at: traking.date,
      });

      if (isDelivered) {
        await this.orderRepository.updateOrder(order_id, {
          isDelivered: true,
        });
      }

      this.messagingService.dispatch(
        new TrakingCreatedEvent({
          message: traking.message,
          date: traking.date,
          name: order.name,
          recipient_id: order.recipient_id,
          traking_code: order.traking_code,
          description: traking.description,
        }),
      );
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
