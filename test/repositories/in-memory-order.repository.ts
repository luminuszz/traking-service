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

  async findOrderById(order_id: string): Promise<Order | undefined> {
    return this.orders.find((item) => item.id === order_id);
  }

  async updateOrder(order_id: string, order: Partial<Order>): Promise<void> {
    const orderIndex = this.orders.findIndex((item) => item.id === order_id);

    this.orders[orderIndex] = Object.assign(this.orders[orderIndex], {
      ...order,
    });
  }
}
