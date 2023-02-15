import { expect, it, describe } from 'vitest';
import { TrakingService } from '@app/services/traking.service';
import { InMemoryTrakingRepository } from '@test/repositories/in-memory-traking.repository';
import { faker } from '@faker-js/faker';

describe('TrakingService', () => {
  describe('createTraking', () => {
    it('should ble able to createa a Traking', async () => {
      const trakingService = new TrakingService(
        new InMemoryTrakingRepository(),
      );

      expect(trakingService).toBeDefined();

      await expect(
        trakingService.createTraking({
          message: faker.random.words().concat(','),
          order_id: faker.datatype.uuid(),
          recipient_traking_created_at: faker.date.recent(),
        }),
      ).resolves.toBeUndefined();
    });
  });
});
