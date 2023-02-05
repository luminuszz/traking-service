import { Traking } from '@app/entities/traking.entity';

export abstract class TrakingRepository {
  abstract save(traking: Traking): Promise<void>;
}
