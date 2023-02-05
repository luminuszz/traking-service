import { Order } from '@app/entities/order.entity';
import { ObjectId } from 'bson';

interface TrakingProps {
  order_id: string;
  message: string;
  recipient_traking_created_at: Date;
}

export class Traking {
  private readonly _id: string;

  public Order: Order;

  constructor(private readonly props: TrakingProps, id?: string) {
    this._id = id || new ObjectId().toString('hex');
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
}
