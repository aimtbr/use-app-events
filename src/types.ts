// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Listener<Type extends string, P = any> = {
  /** Event type the listener is waiting for. */
  eventType: Type;
  /** Function to call on event. */
  callback: Callback<void> | Callback<P>;
  /**  */
  callerId?: string;
  isEventGroup?: boolean;
};

export type Callback<P = void, R = void> = P extends void
  ? () => R
  : P extends [infer A, ...infer Rest] // tuple args
  ? (...args: [A, ...Rest]) => R
  : P extends [] // array args
  ? (...args: P[]) => R
  : (arg: P) => R;

export type UseAppEventsReturn<Type extends string> = {
  /** Subscribe and listen for the specified event type to occur in the app. */
  listenForEvents<Payload>(
    this: void,
    eventType: Type,
    callback: Callback<void> | Callback<Payload>
  ): CleanupFunction;

  /** Subscribe and listen for the specified event types to occur in the app. */
  listenForEvents<Payload>(
    this: void,
    eventGroup: Type[],
    callback: Callback<void> | Callback<Type> | Callback<[Type, Payload]>
  ): CleanupFunction;

  /** Notify all listeners of the specified event type subscribed via `listenForEvents`. */
  notifyEventListeners<Payload>(
    this: void,
    eventType: Type,
    payload?: Payload,
    /** When false, the event is not sent to other browsing contexts. */
    broadcast?: boolean
  ): void;
};

export type CleanupFunction = Callback;
