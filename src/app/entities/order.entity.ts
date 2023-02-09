import { Traking } from '@app/entities/traking.entity';
import { ObjectId } from 'bson';

interface OrderProps {
  recipient_id: string;
  traking_code: string;
  created_at: Date;
  updated_at: Date | null;
  isDeliveried: boolean;
  id?: string;
  name?: string;
}

export class Order {
  public readonly _id: string;

  private readonly _created_at: Date;

  private readonly update_at: Date | null;

  constructor(private readonly props: OrderProps, id?: string) {
    this._id = id || new ObjectId().toString('hex');
  }

  public get traking_code(): string {
    return this.props.traking_code;
  }

  public set traking_code(value: string) {
    this.props.traking_code = value;
  }

  public get recipient_id(): string {
    return this.props.recipient_id;
  }

  public set recipient_id(value: string) {
    this.props.recipient_id = value;
  }

  public get created_at(): Date {
    return this._created_at;
  }

  public get id() {
    return this._id;
  }

  public get isDeliveried(): boolean {
    return this.props.isDeliveried;
  }

  public set isDeliveried(value: boolean) {
    this.props.isDeliveried = value;
  }

  public get updated_at() {
    return this.props.updated_at;
  }

  public set updatet_at(value: Date) {
    this.props.updated_at = value;
  }

  public get name() {
    return this.props.name;
  }

  public set name(value: string) {
    this.props.name = value;
  }

  public trakings: Traking[];
}
