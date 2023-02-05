import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';
import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../contracts/order.repository';
import { OrderAlreadyExistsError } from '@app/services/errors/order-already-exists.error';
import { TrakingFinderProvider } from '@app/contracts/traking-finder.provider';
import { TrakingService } from '@app/services/traking.service';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private readonly trakingFindProvider: TrakingFinderProvider,
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

    await this.orderRepository.save(order);
  }

  public async findOrderById(order_id: string): Promise<Order | undefined> {
    return this.orderRepository.findOrderById(order_id);
  }

  public async refreshOrderTraking(order_id: string): Promise<void> {
    const { traking_code } = await this.orderRepository.findOrderById(order_id);

    const { traking, isDelivered } =
      await this.trakingFindProvider.getTrakingOrderStatus(traking_code);

    await this.trakingService.createTraking({
      message: traking.message,
      order_id: order_id,
    });

    if (isDelivered) {
      await this.orderRepository.updateOrder(order_id, {
        isDeliveried: true,
      });
    }
  }
}
