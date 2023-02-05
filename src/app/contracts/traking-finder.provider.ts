export interface TrakingWithStatus {
  traking: {
    message: string;
    date: string;
  };
  isDelivered: boolean;
}

export abstract class TrakingFinderProvider {
  abstract getTrakingOrderStatus(
    traking_code: string,
  ): Promise<TrakingWithStatus>;
}
