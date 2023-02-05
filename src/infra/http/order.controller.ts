import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from '@app/services/order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOder(@Body('traking_code') traking_code: string) {
    await this.orderService.createOrder({
      recipient_id: '1',
      traking_code,
    });
  }

  @Get(':order_id')
  async refreshOrderTraking(@Param('order_id') order_id: string) {
    await this.orderService.refreshOrderTraking(order_id);
  }
}
