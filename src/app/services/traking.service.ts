import { TrakingRepository } from '@app/contracts/traking.repository';
import { CreateTrakingDto } from '@app/dto/create-traking.dto';
import { Traking } from '@app/entities/traking.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TrakingService {
  constructor(private readonly trakingRepository: TrakingRepository) {}

  async createTraking({ message, order_id, recipient_traking_created_at, description }: CreateTrakingDto) {
    const traking = Traking.create({
      message,
      order_id,
      recipient_traking_created_at,
      description: description ?? null,
    });

    await this.trakingRepository.save(traking);
  }

  async createManyTraking(trakings: CreateTrakingDto[]) {
    const trakingsToSave = trakings.map((traking) => {
      return Traking.create({
        message: traking.message,
        order_id: traking.order_id,
        recipient_traking_created_at: traking.recipient_traking_created_at,
        description: traking.description ?? null,
      });
    });

    await this.trakingRepository.saveManyTrakings(trakingsToSave);
  }

  async findMoreRecentTrakingByOrderId(order_id: string) {
    return await this.trakingRepository.findMoreRecentTrakingWithOrder_id(order_id);
  }
}
