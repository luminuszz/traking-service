import { describe, expect, it } from 'vitest';
import { Order } from '@app/entities/order.entity';
import { faker } from '@faker-js/faker';

describe('Order', () => {
  it('should be able to create a new order', () => {
    const order = new Order({
      isDelivered: false,
      created_at: new Date(),
      traking_code: '123456789',
      updated_at: null,
      recipient_id: '123456789',
      name: 'Teste',
    });

    const now = new Date();
    const name = faker.commerce.productName();
    const recipient_id = faker.database.mongodbObjectId();

    order.updated_at = now;
    order.name = name;
    order.traking_code = '123456789';
    order.recipient_id = recipient_id;

    expect(order).toBeInstanceOf(Order);
    expect(order).toHaveProperty('id');
    expect(order).toHaveProperty('recipient_id', recipient_id);
    expect(order).toHaveProperty('traking_code', '123456789');
    expect(order).toHaveProperty('created_at');
    expect(order).toHaveProperty('updated_at', now);
    expect(order).toHaveProperty('isDelivered', false);
    expect(order).toHaveProperty('name', name);
  });

  it('should be able to create order with id ', () => {
    const id = faker.database.mongodbObjectId();

    const order = new Order(
      {
        isDelivered: false,
        created_at: new Date(),
        traking_code: '123456789',
        updated_at: null,
        recipient_id: '123456789',
        name: 'Teste',
      },
      id,
    );

    expect(order).toBeInstanceOf(Order);
    expect(order.id).toBe(id);
  });
});
