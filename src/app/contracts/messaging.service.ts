export interface UpdateOrderStatusTrakingEvent {
  traking_code: string;
  message: string;
  date: Date;
  recipient_id: string;
}

export abstract class MessagingService {
  abstract updateOrderStatusTraking(payload: UpdateOrderStatusTrakingEvent);
}
