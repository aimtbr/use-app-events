export type Listener<P, Type extends string = string> = {
  eventType: Type;
  instanceId: string;
  callback: Callback<P>;
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
  listenForEvents: <Payload>(
    eventType: Type,
    callback: Callback<Payload | void>
  ) => void;

  /** Notify all listeners of the specified event type subscribed via `listenForEvents`. */
  notifyEventListeners: <Payload>(eventType: Type, payload: Payload) => void;
};
