import { Traking } from '@app/entities/traking.entity';

export abstract class TrakingRepository {
  abstract save(traking: Traking): Promise<void>;

  abstract saveManyTrakings(trakings: Traking[]): Promise<void>;

  abstract findMoreRecentTrakingWithOrder_id(
    order_id: string,
  ): Promise<Traking | undefined>;
}
