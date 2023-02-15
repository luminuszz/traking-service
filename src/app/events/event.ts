export abstract class EventBus<EventPayload> {
  public abstract eventName: string;

  public payload: EventPayload;

  public constructor(props: EventPayload) {
    this.payload = props;
  }
}
