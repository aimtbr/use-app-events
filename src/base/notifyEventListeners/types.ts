export type BaseNotifyEventListenersOptions = {
  debug?: boolean;
  scopeKey?: string;
};
export type BaseNotifyEventListeners<EventType extends string> = {
  /** Notify all listeners of the specified event type subscribed via `listenForEvents`. */
  <Payload, Type extends EventType>(
    eventType: Type,
    payload?: Payload,
    broadcast?: boolean
  ): void;

  /** Notify all listeners of the specified event types subscribed via `listenForEvents`. */
  <Payload, Type extends EventType>(
    eventTypes: Type[],
    payload?: Payload,
    broadcast?: boolean
  ): void;
};
