import { TrakingRepository } from '@app/contracts/traking.repository';
import { Injectable } from '@nestjs/common';
import { Traking } from '@app/entities/traking.entity';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { PrismaTrakingMapper } from '@infra/database/prisma/mappers/prisma-traking.mapper';

@Injectable()
export class PrismaTrakingRepository implements TrakingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(traking: Traking): Promise<void> {
    await this.prisma.traking.create({
      data: {
        order_id: traking.order_id,
        message: traking.message,
        recipient_traking_created_at: new Date(
          traking.recipient_traking_created_at,
        ),
      },
    });
  }

  async saveManyTrakings(trakings: Traking[]): Promise<void> {
    const trakingsToSave = trakings.map((traking) => ({
      message: traking.message,
      recipient_traking_created_at: new Date(
        traking.recipient_traking_created_at,
      ),
      order_id: traking.order_id,
    }));

    await this.prisma.traking.createMany({
      data: trakingsToSave,
    });
  }

  async findMoreRecentTrakingWithOrder_id(
    order_id: string,
  ): Promise<Traking | null> {
    const [results] = await this.prisma.traking.findMany({
      where: {
        order_id: order_id,
        recipient_traking_created_at: {
          lte: new Date(),
        },
      },
      orderBy: {
        recipient_traking_created_at: 'desc',
      },
    });

    return results ? PrismaTrakingMapper.toDomain(results) : null;
  }
}
