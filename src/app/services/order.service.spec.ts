import { OrderService } from './order.service';

import { describe, it, expect } from 'vitest';

import { faker } from '@faker-js/faker';
import { InMemoryOrderRepository } from '@test/repositories/in-memory-order.repository';
import { OrderAlreadyExistsError } from '@app/services/errors/order-already-exists.error';

describe('OrderService', () => {
  describe('createOrder', () => {
    it('shold create a new order', async () => {
      const orderService = new OrderService(new InMemoryOrderRepository());

      await expect(
        orderService.createOrder({
          traking_code: faker.datatype.string(),
          recipient_id: faker.datatype.uuid(),
        }),
      ).resolves.toBeUndefined();
    });

    it('should not ble to creeate a new order with a traking code that already exists', async () => {
      const orderService = new OrderService(new InMemoryOrderRepository());

      const traking_code = faker.datatype.string();

      await orderService.createOrder({
        traking_code,
        recipient_id: '1',
      });

      await expect(
        orderService.createOrder({
          traking_code,
          recipient_id: '1',
        }),
      ).rejects.toBeInstanceOf(OrderAlreadyExistsError);
    });
  });
});
