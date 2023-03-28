import { DomainEvent } from '@app/events/event';

type NewTrakingCreatedEventProps = {
  date: Date;
  message: string;
  recipient_id: string;
  traking_code: string;
  name: string;
  description: string | null;
};

export class TrakingCreatedEvent extends DomainEvent<NewTrakingCreatedEventProps> {
  public eventName = 'notification.update-order-status';
}
