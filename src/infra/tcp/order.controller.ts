import { Controller } from '@nestjs/common';
import { OrderService } from '@app/services/order.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOrderDto } from '@app/dto/create-order.dto';
import { RefreshOrderTrakingDto } from '@infra/tcp/dto/refresh-order-traking.dto';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern('traking.create-order')
  async createOrderEventHandler(
    @Payload() { traking_code, recipient_id, name }: CreateOrderDto,
  ) {
    await this.orderService.createOrder({
      recipient_id,
      traking_code,
      name,
    });
  }

  @EventPattern('traking.refresh-order-traking')
  async refreshOrderTrakingEventHandler(
    @Payload() { order_id }: RefreshOrderTrakingDto,
  ) {
    await this.orderService.refreshOrderTraking(order_id);
  }

  @MessagePattern('traking.find-all-orders')
  async findAllOrdersNotDelivered() {
    return this.orderService.findAllOrders();
  }
}
