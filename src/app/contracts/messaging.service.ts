import { EventBus } from '@app/events/event';

export abstract class MessagingService {
  abstract dispatch(event: EventBus<unknown>);
}
