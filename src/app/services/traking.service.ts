import { Injectable } from '@nestjs/common';
import { Traking } from '@app/entities/traking.entity';
import { TrakingRepository } from '@app/contracts/traking.repository';
import { CreateTrakingDto } from '@app/dto/create-traking.dto';

@Injectable()
export class TrakingService {
  constructor(private trakingRepository: TrakingRepository) {}

  async createTraking({ message, order_id }: CreateTrakingDto) {
    const traking = new Traking({
      message,
      order_id,
    });

    await this.trakingRepository.save(traking);
  }
}
