import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from '@app/services/order.service';
import { CreateOrderDto } from '@infra/http/dto/create-order-.dto';
import { RefreshOrderTrakingDto } from '@infra/http/dto/refresh-order-traking.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOder(@Body() { traking_code, recipient_id }: CreateOrderDto) {
    await this.orderService.createOrder({
      recipient_id,
      traking_code,
    });
  }

  @Get(':order_id')
  async refreshOrderTraking(@Param() { order_id }: RefreshOrderTrakingDto) {
    await this.orderService.refreshOrderTraking(order_id);
  }
}
