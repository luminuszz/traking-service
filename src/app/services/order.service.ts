import { CreateOrderDto } from '../dto/createOrder.dto';
import { Order } from '../entities/order.entity';
import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../contracts/order.repository';
import { OrderAlreadyExistsError } from '@app/services/errors/order-already-exists.error';

@Injectable()
export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

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
}
