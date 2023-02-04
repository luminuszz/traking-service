import { OrderRepository } from '@app/contracts/order.repository';
import { Order } from '@app/entities/order.entity';

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Order[] = [];

  async save(order: Order): Promise<void> {
    this.orders.push(order);
  }

  async findOrderByTrakingCode(
    traking_code: string,
  ): Promise<Order | undefined> {
    return this.orders.find((item) => item.traking_code === traking_code);
  }
}
