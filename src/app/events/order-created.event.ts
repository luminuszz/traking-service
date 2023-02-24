import { DomainEvent } from '@app/events/event';
import { Order } from '@app/entities/order.entity';

type OrderCreatedEventProps = {
  order: Order;
};

export class OrderCreatedEvent extends DomainEvent<OrderCreatedEventProps> {
  public eventName = 'notification.order.created';
}
