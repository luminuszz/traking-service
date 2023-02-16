import { DomainEvent } from '@app/events/event';

export abstract class MessagingService {
  abstract dispatch(event: DomainEvent<unknown>);
}
