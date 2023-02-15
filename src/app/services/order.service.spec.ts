import { OrderService } from './order.service';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { faker } from '@faker-js/faker';
import { InMemoryOrderRepository } from '@test/repositories/in-memory-order.repository';
import { OrderAlreadyExistsError } from '@app/services/errors/order-already-exists.error';
import { TrakingService } from '@app/services/traking.service';
import { InMemoryTrakingRepository } from '@test/repositories/in-memory-traking.repository';
import { DeliveryServiceProvider } from '@app/contracts/traking-finder.provider';
import { MessagingService } from '@app/contracts/messaging.service';
import { Order } from '@app/entities/order.entity';
import { subDays, isToday } from 'date-fns';
import { OrderNotFoundError } from '@app/services/errors/order-not-found.error';

const fakeDeliveryServiceProvider: DeliveryServiceProvider = {
  getAllTrakingByTrakingCode: async () => [],
  async getMoreRecentTrakingOrder(traking_code: string) {
    return {
      traking: {
        message: faker.lorem.sentence(),
        date: faker.date.past(),
      },
      isDelivered: false,
    };
  },
};

const fakerMessagingService: MessagingService = {
  dispatch(payload: any) {
    return Promise.resolve();
  },
};

describe('OrderService', () => {
  let orderRepository: InMemoryOrderRepository;
  let trakingService: TrakingService;
  let trakingRepository: InMemoryTrakingRepository;

  describe('createOrder', () => {
    beforeEach(() => {
      orderRepository = new InMemoryOrderRepository();
      trakingRepository = new InMemoryTrakingRepository();
      trakingService = new TrakingService(trakingRepository);
    });

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
          date: faker.datatype.datetime(),
        },
        {
          message: faker.lorem.sentence(),
          date: faker.datatype.datetime(),
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
    beforeEach(() => {
      orderRepository = new InMemoryOrderRepository();
      trakingRepository = new InMemoryTrakingRepository();
      trakingService = new TrakingService(trakingRepository);
    });

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

      const order = Order.create({ ...createOderDto, isDelivered: false });
      const order2 = Order.create({ ...createOderDto, isDelivered: true });

      await orderRepository.save(order);
      await orderRepository.save(order2);

      const results =
        await orderService.findAllOrdersThatNotHaveBeenDelivered();

      console.log({ results });

      expect(results).toHaveLength(1);
      expect(results[0]).toHaveProperty('isDelivered', false);
    });
  });

  describe('refreshOrderTraking', () => {
    beforeEach(() => {
      orderRepository = new InMemoryOrderRepository();
      trakingRepository = new InMemoryTrakingRepository();
      trakingService = new TrakingService(trakingRepository);
    });

    it('should ble able to refresh order traking if order already have trakings registred', async () => {
      const orderService = new OrderService(
        orderRepository,
        fakeDeliveryServiceProvider,
        trakingService,
        fakerMessagingService,
      );

      const yesterday = subDays(Date.now(), 1);

      vi.spyOn(
        fakeDeliveryServiceProvider,
        'getAllTrakingByTrakingCode',
      ).mockResolvedValue([
        {
          message: faker.lorem.sentence(),
          date: yesterday,
        },
      ]);

      await orderService.createOrder({
        traking_code: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        recipient_id: faker.datatype.uuid(),
      });

      const order = orderRepository.orders[0];

      vi.spyOn(
        fakeDeliveryServiceProvider,
        'getMoreRecentTrakingOrder',
      ).mockResolvedValue({
        traking: {
          message: 'Objeto em transito',
          date: new Date(),
        },
        isDelivered: false,
      });

      await orderService.refreshOrderTraking(order.id);

      const traking = await trakingService.findMoreRecentTrakingByOrderId(
        order.id,
      );
      expect(traking).toHaveProperty('message', 'Objeto em transito');

      expect(traking).toHaveProperty('recipient_traking_created_at');

      expect(isToday(traking.recipient_traking_created_at)).toBeTruthy();
    });

    it('it shold be able to refresh order traking if order no have trakings registred yet', async () => {
      const orderService = new OrderService(
        orderRepository,
        fakeDeliveryServiceProvider,
        trakingService,
        fakerMessagingService,
      );

      const order_id = faker.database.mongodbObjectId();

      const order = Order.create(
        {
          updated_at: faker.datatype.datetime(),
          traking_code: faker.datatype.uuid(),
          recipient_id: faker.datatype.uuid(),
          isDelivered: false,
          name: faker.commerce.productName(),
          created_at: faker.datatype.datetime(),
        },
        order_id,
      );

      await orderRepository.save(order);

      const message = 'Objeto em transito';

      vi.spyOn(
        fakeDeliveryServiceProvider,
        'getMoreRecentTrakingOrder',
      ).mockResolvedValue({
        traking: {
          message,
          date: faker.datatype.datetime(),
        },
        isDelivered: false,
      });

      await orderService.refreshOrderTraking(order_id);

      const traking = await trakingService.findMoreRecentTrakingByOrderId(
        order_id,
      );

      expect(traking).toHaveProperty('message', message);
      expect(traking).toHaveProperty('order_id', order_id);
      expect(traking.message).toBe(message);
    });

    it('should not be able to refresh order traking if order not exists', async () => {
      const orderService = new OrderService(
        orderRepository,
        fakeDeliveryServiceProvider,
        trakingService,
        fakerMessagingService,
      );

      await orderService.createOrder({
        traking_code: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        recipient_id: faker.datatype.uuid(),
      });

      const fake_id = faker.datatype.uuid();

      await expect(
        orderService.refreshOrderTraking(fake_id),
      ).rejects.toBeInstanceOf(OrderNotFoundError);
    });

    it('not should be able to refresh order traking if deliveryServiceProvider not return trakings', async () => {
      const orderService = new OrderService(
        orderRepository,
        fakeDeliveryServiceProvider,
        trakingService,
        fakerMessagingService,
      );

      vi.spyOn(
        fakeDeliveryServiceProvider,
        'getAllTrakingByTrakingCode',
      ).mockResolvedValue([]);

      vi.spyOn(
        fakeDeliveryServiceProvider,
        'getMoreRecentTrakingOrder',
      ).mockResolvedValue(null);

      const spyRefreshOrderTraking = vi.spyOn(
        orderService,
        'refreshOrderTraking',
      );

      await orderService.createOrder({
        traking_code: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        recipient_id: faker.datatype.uuid(),
      });

      const order = orderRepository.orders[0];

      await orderService.refreshOrderTraking(order.id);

      const traking = await trakingService.findMoreRecentTrakingByOrderId(
        order.id,
      );

      expect(traking).toBeFalsy();
      await expect(spyRefreshOrderTraking).toBeCalled();
    });

    it('should be able to update order to delivered if order traking marked to be delivered and order not have trakings registred yet', async () => {
      const orderService = new OrderService(
        orderRepository,
        fakeDeliveryServiceProvider,
        trakingService,
        fakerMessagingService,
      );

      vi.spyOn(
        fakeDeliveryServiceProvider,
        'getAllTrakingByTrakingCode',
      ).mockResolvedValue([]);

      vi.spyOn(
        fakeDeliveryServiceProvider,
        'getMoreRecentTrakingOrder',
      ).mockResolvedValue({
        traking: {
          message: 'Objeto entregue ao destinatário',
          date: new Date(),
        },
        isDelivered: true,
      });

      await orderService.createOrder({
        traking_code: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        recipient_id: faker.datatype.uuid(),
      });

      const order = orderRepository.orders[0];

      await orderService.refreshOrderTraking(order.id);

      expect(order.isDelivered).toBeTruthy();
    });

    it('should be able to update order to delivered if order traking marked to be delivered and order have trakings registred', async () => {
      const orderService = new OrderService(
        orderRepository,
        fakeDeliveryServiceProvider,
        trakingService,
        fakerMessagingService,
      );

      vi.spyOn(
        fakeDeliveryServiceProvider,
        'getAllTrakingByTrakingCode',
      ).mockResolvedValue([
        {
          message: 'Objeto em transito',
          date: subDays(new Date(), 1),
        },
      ]);

      vi.spyOn(
        fakeDeliveryServiceProvider,
        'getMoreRecentTrakingOrder',
      ).mockResolvedValue({
        traking: {
          message: 'Objeto entregue ao destinatário',
          date: new Date(),
        },
        isDelivered: true,
      });

      await orderService.createOrder({
        traking_code: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        recipient_id: faker.datatype.uuid(),
      });

      const order = orderRepository.orders[0];

      await orderService.refreshOrderTraking(order.id);

      expect(order.isDelivered).toBeTruthy();
    });
  });

  describe('findOrderById', () => {
    beforeEach(() => {
      orderRepository = new InMemoryOrderRepository();
      trakingRepository = new InMemoryTrakingRepository();
      trakingService = new TrakingService(trakingRepository);
    });

    it('should be able to find order by id', async () => {
      const orderService = new OrderService(
        orderRepository,
        fakeDeliveryServiceProvider,
        trakingService,
        fakerMessagingService,
      );

      const name = 'Faraol de carro';

      await orderService.createOrder({
        traking_code: faker.datatype.uuid(),
        name,
        recipient_id: faker.datatype.uuid(),
      });

      const { id } = orderRepository.orders[0];

      const results = await orderService.findOrderById(id);

      expect(results).toHaveProperty('id', id);
      expect(results).toHaveProperty('traking_code');
      expect(results).toHaveProperty('name', name);
    });

    it('should not be able to find order by id if order not exists', async () => {
      const orderService = new OrderService(
        orderRepository,
        fakeDeliveryServiceProvider,
        trakingService,
        fakerMessagingService,
      );

      const name = 'Faraol de carro';

      await orderService.createOrder({
        traking_code: faker.datatype.uuid(),
        name,
        recipient_id: faker.datatype.uuid(),
      });

      const fake_id = faker.datatype.uuid();

      const results = await orderService.findOrderById(fake_id);

      expect(results).toBeFalsy();
    });
  });

  describe('findAllOrders', () => {
    beforeEach(() => {
      orderRepository = new InMemoryOrderRepository();
      trakingRepository = new InMemoryTrakingRepository();
      trakingService = new TrakingService(trakingRepository);
    });

    it('should be able to find orders', async () => {
      const orderService = new OrderService(
        orderRepository,
        fakeDeliveryServiceProvider,
        trakingService,
        fakerMessagingService,
      );

      const name = 'Faraol de carro';

      await orderService.createOrder({
        traking_code: faker.datatype.uuid(),
        name,
        recipient_id: faker.datatype.uuid(),
      });

      await orderService.createOrder({
        traking_code: faker.datatype.uuid(),
        name,
        recipient_id: faker.datatype.uuid(),
      });

      const results = await orderService.findAllOrders();

      expect(results).toHaveLength(2);
    });
  });
});
