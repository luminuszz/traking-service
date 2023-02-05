export interface TrakingWithStatus {
  traking: {
    message: string;
    date: string;
  };
  isDelivered: boolean;
}

export interface DeliveryTraking {
  message: string;
  date: string;
}

export abstract class DeliveryServiceProvider {
  abstract getMoreRecentTrakingOrder(
    traking_code: string,
  ): Promise<TrakingWithStatus>;

  abstract getAllTrakingByTrakingCode(
    traking_code: string,
  ): Promise<DeliveryTraking[]>;
}
