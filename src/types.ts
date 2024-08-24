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
  // Overload 1
  /** Subscribe and listen for the specified event type to occur in the app. */
  listenForEvents<Payload>(
    this: void,
    eventType: Type,
    callback: Callback<unknown> | Callback<Payload>
  ): void;

  // Overload 2
  listenForEvents<Payload>(
    this: void,
    eventGroup: Type[],
    callback: Callback<Type> | Callback<[Type, Payload]>
  ): void;

  /** Notify all listeners of the specified event type subscribed via `listenForEvents`. */
  notifyEventListeners: <Payload>(eventType: Type, payload: Payload) => void;
};
