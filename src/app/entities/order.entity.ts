interface OrderProps {
  recipient_id: string;
  traking_code: string;
  created_at: Date;
  updated_at: Date | null;
  isDeliveried: boolean;
}

import { randomUUID } from 'node:crypto';

export class Order {
  public readonly _id: string;

  private readonly _created_at: Date;

  private readonly update_at: Date | null;

  constructor(private readonly props: OrderProps, id?: string) {
    this._id = id || randomUUID();
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
}
