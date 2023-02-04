import { Order } from '../entities/order.entity';

export abstract class OrderRepository {
  abstract save(order: Order): Promise<void>;

  abstract findOrderByTrakingCode(
    traking_code: string,
  ): Promise<Order | undefined>;
}
