export interface TrakingWithStatus {
  traking: {
    message: string;
    date: Date;
  };
  isDelivered: boolean;
}

export interface DeliveryTraking {
  message: string;
  date: Date;
}

export abstract class DeliveryServiceProvider {
  abstract getMoreRecentTrakingOrder(
    traking_code: string,
  ): Promise<TrakingWithStatus | null>;

  abstract getAllTrakingByTrakingCode(
    traking_code: string,
  ): Promise<DeliveryTraking[]>;
}
