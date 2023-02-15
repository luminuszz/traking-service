import { ObjectId } from 'bson';

export abstract class Entity<EntityProps> {
  protected readonly _id: string;

  protected props: EntityProps;

  protected constructor(props: EntityProps, id?: string) {
    this.props = props;
    this._id = id || new ObjectId().toString('hex');
  }
}
