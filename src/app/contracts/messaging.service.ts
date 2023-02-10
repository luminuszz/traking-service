export interface UpdateOrderStatusTrakingEvent {
  traking_code: string;
  message: string;
  date: Date;
  recipient_id: string;
  name?: string;
}

export abstract class MessagingService {
  abstract dispatchNewTrakingAddedEvent(payload: UpdateOrderStatusTrakingEvent);
}
