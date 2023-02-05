import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderService } from '@app/services/order.service';

@Injectable()
export class TaskService {
  private logger = new Logger(TaskService.name);

  constructor(private readonly orderService: OrderService) {}

  @Cron(CronExpression.EVERY_2_HOURS)
  async refreshOrderStatus() {
    this.logger.log('Refresh order status task init');

    const orders =
      await this.orderService.findAllOrdersThatNotHaveBeenDelivered();

    for (const order of orders) {
      await this.orderService.refreshOrderTraking(order.id);
    }
  }
}
