import { TrakingRepository } from '@app/contracts/traking.repository';
import { Traking } from '@app/entities/traking.entity';
import { PrismaTrakingMapper } from '@infra/database/prisma/mappers/prisma-traking.mapper';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { compareDesc } from 'date-fns';

@Injectable()
export class PrismaTrakingRepository implements TrakingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(traking: Traking): Promise<void> {
    await this.prisma.traking.create({
      data: {
        order_id: traking.order_id,
        message: traking.message,
        recipient_traking_created_at: traking.recipient_traking_created_at,
        description: traking.description ?? '',
      },
    });
  }

  async saveManyTrakings(trakings: Traking[]): Promise<void> {
    const trakingsToSave = trakings.map((traking) => ({
      message: traking.message,
      recipient_traking_created_at: traking.recipient_traking_created_at,
      order_id: traking.order_id,
      description: traking?.description ?? '',
    }));

    await this.prisma.traking.createMany({
      data: trakingsToSave,
    });
  }

  async findMoreRecentTrakingWithOrder_id(order_id: string): Promise<Traking | null> {
    const results = await this.prisma.traking.findMany({
      where: {
        order_id,
      },
    });

    const [traking] = results.sort((a, b) =>
      compareDesc(a.recipient_traking_created_at, b.recipient_traking_created_at),
    );

    return traking ? PrismaTrakingMapper.toDomain(traking) : null;
  }
}
