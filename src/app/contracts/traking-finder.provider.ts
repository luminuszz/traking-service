export interface TrakingWithStatus {
  traking: {
    message: string;
    date: Date;
    description?: string;
  };
  isDelivered: boolean;
}

export interface DeliveryTraking {
  message: string;
  date: Date;
  description?: string;
}

export abstract class DeliveryServiceProvider {
  abstract getMoreRecentTrakingOrder(
    traking_code: string,
  ): Promise<TrakingWithStatus | null>;

  abstract getAllTrakingByTrakingCode(
    traking_code: string,
  ): Promise<DeliveryTraking[]>;
}
