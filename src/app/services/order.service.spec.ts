import { OrderService } from './order.service';

import { describe, it, expect, beforeEach, vi } from 'vitest';

import { faker } from '@faker-js/faker';
import { InMemoryOrderRepository } from '@test/repositories/in-memory-order.repository';
import { OrderAlreadyExistsError } from '@app/services/errors/order-already-exists.error';
import { TrakingService } from '@app/services/traking.service';
import { InMemoryTrakingRepository } from '@test/repositories/in-memory-traking.repository';
import { DeliveryServiceProvider } from '@app/contracts/traking-finder.provider';
import { MessagingService } from '@app/contracts/messaging.service';
import { OrderRepository } from '@app/contracts/order.repository';
import { TrakingRepository } from '@app/contracts/traking.repository';
import { Order } from '@app/entities/order.entity';

const fakeDeliveryServiceProvider: DeliveryServiceProvider = {
  getAllTrakingByTrakingCode: async () => [],
  async getMoreRecentTrakingOrder(traking_code: string) {
    return {
      traking: {
        message: faker.lorem.sentence(),
        date: faker.date.past().toString(),
      },
      isDelivered: false,
    };
  },
};

const fakerMessagingService: MessagingService = {
  updateOrderStatusTraking(payload: any) {
    return Promise.resolve();
  },
};

describe('OrderService', () => {
  let orderRepository: InMemoryOrderRepository;
  let trakingService: TrakingService;

  let trakingRepository: InMemoryTrakingRepository;

  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository();
    trakingRepository = new InMemoryTrakingRepository();
    trakingService = new TrakingService(trakingRepository);
  });

  describe('createOrder', () => {
    it('shold create a new order', async () => {
      const trakingService = new TrakingService(
        new InMemoryTrakingRepository(),
      );

      const orderService = new OrderService(
        orderRepository,
        fakeDeliveryServiceProvider,
        trakingService,
        fakerMessagingService,
      );

      await expect(
        orderService.createOrder({
          traking_code: faker.datatype.string(),
          recipient_id: faker.datatype.uuid(),
        }),
      ).resolves.toBeUndefined();
    });

    it('should not ble to creeate a new order with a traking code that already exists', async () => {
      const orderService = new OrderService(
        orderRepository,
        fakeDeliveryServiceProvider,
        trakingService,
        fakerMessagingService,
      );

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

    it('create a new order with trakings', async () => {
      const orderService = new OrderService(
        orderRepository,
        fakeDeliveryServiceProvider,
        trakingService,
        fakerMessagingService,
      );

      // emule deliveryServiceReturn trakings

      const trakings = [
        {
          message: faker.lorem.sentence(),
          date: faker.datatype.datetime().toISOString(),
        },
        {
          message: faker.lorem.sentence(),
          date: faker.datatype.datetime().toISOString(),
        },
      ];

      vi.spyOn(
        fakeDeliveryServiceProvider,
        'getAllTrakingByTrakingCode',
      ).mockResolvedValue(trakings);

      await orderService.createOrder({
        traking_code: faker.datatype.string(),
        recipient_id: faker.datatype.uuid(),
      });

      expect(trakingRepository).toHaveProperty('trackings');
      expect(trakingRepository.trackings).toHaveLength(2);
      expect(trakingRepository.trackings[0]).toHaveProperty('message');
    });
  });

  describe('findAllOrdersThatNotHaveBeenDelivered', () => {
    it('should be to find all orders that not have been delivered', async () => {
      const orderService = new OrderService(
        orderRepository,
        fakeDeliveryServiceProvider,
        trakingService,
        fakerMessagingService,
      );

      const createOderDto = {
        recipient_id: faker.datatype.uuid(),
        isDeliveried: false,
        traking_code: faker.datatype.string(),
        created_at: faker.datatype.datetime(),
        updated_at: faker.datatype.datetime(),
      };

      const order = new Order({ ...createOderDto, isDeliveried: false });
      const order2 = new Order({ ...createOderDto, isDeliveried: true });

      await orderRepository.save(order);
      await orderRepository.save(order2);

      const results =
        await orderService.findAllOrdersThatNotHaveBeenDelivered();

      expect(results).toHaveLength(1);
      expect(results[0]).toHaveProperty('isDeliveried', false);
    });
  });
});
