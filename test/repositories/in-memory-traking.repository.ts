import { TrakingRepository } from '@app/contracts/traking.repository';
import { Traking } from '@app/entities/traking.entity';
import { compareDesc } from 'date-fns';

export class InMemoryTrakingRepository implements TrakingRepository {
  public trackings: Traking[] = [];

  constructor() {
    this.trackings = [];
  }

  async save(traking: Traking): Promise<void> {
    this.trackings.push(traking);
  }

  async saveManyTrakings(trakings: Traking[]): Promise<void> {
    this.trackings.push(...trakings);
  }

  async findMoreRecentTrakingWithOrder_id(order_id: string): Promise<Traking> {
    const [traking] = this.trackings
      .sort((a, b) =>
        compareDesc(
          new Date(a.recipient_traking_created_at),
          new Date(b.recipient_traking_created_at),
        ),
      )
      .filter((item) => item.order_id === order_id);

    return traking;
  }
}
