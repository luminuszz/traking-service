import { CreateOrderDto } from '@app/dto/create-order.dto';
import { OrderService } from '@app/services/order.service';
import { RefreshOrderTrakingDto } from '@infra/tcp/dto/refresh-order-traking.dto';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class OrderController {
  private logger = new Logger(OrderController.name);
  constructor(private readonly orderService: OrderService) {}

  @EventPattern('traking.create-order')
  async createOrderEventHandler(@Payload() { traking_code, recipient_id, name }: CreateOrderDto) {
    await this.orderService.createOrder({
      recipient_id,
      traking_code,
      name,
    });
  }

  @MessagePattern('traking.find-all-orders')
  async findAllOrdersNotDelivered() {
    this.logger.log('Received message to find all orders  -> traking.find-all-orders');

    const response = await this.orderService.findAllOrders();

    return response;
  }

  @MessagePattern('traking.find-all-pending-orders')
  async findAllOrdersPending() {
    this.logger.log('Received message to find all orders pending -> traking.find-all-pending-orders');
    const response = await this.orderService.findAllOrdersThatNotHaveBeenDelivered();
    return response;
  }

  @EventPattern('traking.refresh-order-traking')
  async refreshOrderTrakingEventHandler(@Payload() { order_id }: RefreshOrderTrakingDto) {
    this.logger.log(`Refreshing order status by order call -> ${order_id} `);
    await this.orderService.refreshOrderTraking(order_id);
  }

  @EventPattern('tasks.refresh-order-status')
  async refreshOrderStatusEventHandler(@Payload() { order_id }: RefreshOrderTrakingDto) {
    this.logger.log(`Refreshing order status by order task -> ${order_id} `);
    await this.orderService.refreshOrderTraking(order_id);
  }
}
