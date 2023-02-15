import { EventBus } from '@app/events/event';

type NewTrakingCreatedEventProps = {
  date: Date;
  message: string;
  recipient_id: string;
  traking_code: string;
  name: string;
};

export class NewTrakingCreatedEvent extends EventBus<NewTrakingCreatedEventProps> {
  public eventName = 'notification.update-order-status';
}
