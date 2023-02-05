import { TrakingRepository } from '@app/contracts/traking.repository';
import { Injectable } from '@nestjs/common';
import { Traking } from '@app/entities/traking.entity';
import { PrismaService } from '@infra/database/prisma/prisma.service';

@Injectable()
export class PrismaTrakingRepository implements TrakingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(traking: Traking): Promise<void> {
    await this.prisma.traking.create({
      data: {
        order_id: traking.order_id,
        message: traking.message,
      },
    });
  }
}
