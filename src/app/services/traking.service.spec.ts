import { Traking } from '@app/entities/traking.entity';
import { TrakingService } from '@app/services/traking.service';
import { faker } from '@faker-js/faker';
import { InMemoryTrakingRepository } from '@test/repositories/in-memory-traking.repository';
import { isEqual } from 'date-fns';
import { beforeEach, describe, expect, it } from 'vitest';

describe('TrakingService', () => {
  let trakingRepository: InMemoryTrakingRepository;

  beforeEach(() => {
    trakingRepository = new InMemoryTrakingRepository();
  });

  describe('createTraking', () => {
    it('should ble able to createa a Traking', async () => {
      const trakingService = new TrakingService(trakingRepository);

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

  describe('createManyTraking', () => {
    it('should be able to create many trakings', async () => {
      const trakingService = new TrakingService(trakingRepository);

      const firstTraking = Traking.create({
        message: faker.lorem.sentence(),
        recipient_traking_created_at: faker.date.recent(),
        order_id: faker.datatype.uuid(),
      });

      const secondTraking = Traking.create({
        message: faker.lorem.sentence(),
        recipient_traking_created_at: faker.date.recent(),
        order_id: faker.datatype.uuid(),
      });

      await trakingService.createManyTraking([firstTraking, secondTraking]);

      expect(trakingRepository.trackings).toHaveLength(2);
    });
  });

  describe('findMoreRecentTrakingByOrderId', () => {
    it('should be able to get more Recent Traking By OrderId', async () => {
      const trakingService = new TrakingService(trakingRepository);

      const order_id = faker.datatype.uuid();

      const today = new Date();

      const moreRecentTraking = Traking.create({
        message: faker.lorem.sentence(),
        order_id,
        recipient_traking_created_at: faker.date.recent(1, today),
      });

      const oldTraking = Traking.create({
        message: faker.lorem.sentence(),
        order_id,
        recipient_traking_created_at: faker.date.recent(3, today),
      });

      await trakingService.createManyTraking([moreRecentTraking, oldTraking]);

      const response = await trakingService.findMoreRecentTrakingByOrderId(order_id);

      expect(response.message).toBe(moreRecentTraking.message);
      expect(response.order_id).toBe(moreRecentTraking.order_id);
      expect(response.recipient_traking_created_at).not.toBe(oldTraking.recipient_traking_created_at);
      expect(
        isEqual(response.recipient_traking_created_at, moreRecentTraking.recipient_traking_created_at),
      ).toBeTruthy();
    });
  });
});
