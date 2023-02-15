import { describe, expect, it } from 'vitest';
import { faker } from '@faker-js/faker';
import { Traking } from '@app/entities/traking.entity';

describe('Traking', () => {
  it('should be able to create a new traking', () => {
    const traking = Traking.create({
      order_id: faker.database.mongodbObjectId(),
      recipient_traking_created_at: new Date(),
      message: faker.lorem.sentence(),
    });

    expect(traking).toBeInstanceOf(Traking);
    expect(traking).toHaveProperty('id');
  });

  it('should be able to create traking with id ', () => {
    const id = faker.database.mongodbObjectId();

    const order = Traking.create(
      {
        order_id: faker.database.mongodbObjectId(),
        recipient_traking_created_at: new Date(),
        message: faker.lorem.sentence(),
      },
      id,
    );

    expect(order).toBeInstanceOf(Traking);
    expect(order.id).toBe(id);
  });
});
