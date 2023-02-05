import { TrakingRepository } from '@app/contracts/traking.repository';
import { Traking } from '@app/entities/traking.entity';

export class InMemoryTrakingRepository implements TrakingRepository {
  private trackings: Traking[] = [];

  async save(traking: Traking): Promise<void> {
    this.trackings.push(traking);
  }
}
