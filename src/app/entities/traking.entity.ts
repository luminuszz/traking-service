import { Order } from '@app/entities/order.entity';

import { Entity } from '@app/entities/entity';

interface TrakingProps {
  order_id: string;
  message: string;
  recipient_traking_created_at: Date;
  description: string | null;
}

export class Traking extends Entity<TrakingProps> {
  public Order: Order;

  public get description(): string | null {
    return this.props.description;
  }

  public get id(): string {
    return this._id;
  }

  public get order_id(): string {
    return this.props.order_id;
  }

  public get message(): string {
    return this.props.message;
  }

  public get recipient_traking_created_at(): Date {
    return this.props.recipient_traking_created_at;
  }

  static create(props: TrakingProps, id?: string): Traking {
    return new Traking(props, id);
  }
}
