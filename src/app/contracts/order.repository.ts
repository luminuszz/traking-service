import { Order } from '../entities/order.entity';

export abstract class OrderRepository {
  abstract save(order: Order): Promise<void>;

  abstract findOrderByTrakingCode(
    traking_code: string,
  ): Promise<Order | undefined>;

  abstract findOrderById(order_id: string): Promise<Order | undefined>;

  abstract updateOrder(order_id: string, order: Partial<Order>): Promise<void>;

  abstract findAllOrdersWithIsDeliveryFalse(): Promise<Order[]>;

  abstract findAllOrders(): Promise<Order[]>;
}
