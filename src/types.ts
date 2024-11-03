// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Listener<Type extends string, P = any> = {
  /** Event type the listener is waiting for. */
  eventType: Type;

  /** Function to call on event. */
  callback:
    | Callback<void>
    | Callback<P>
    | AsyncCallback<void>
    | AsyncCallback<P>;

  /** Unique identifier of the context in which the listener was created. */
  scopeKey?: string;

  /**
   * Unique identifier of the event group.
   *
   * Note: It is used if `listenForEvents` has been called with an array of event types.
   */
  eventGroupId?: string;

  /** Boolean indicating whether the listener should be called only once if the event occurs. */
  shouldBeCalledOnce?: boolean;

  /** Boolean indicating whether the listener has been called at least once. */
  hasBeenCalled?: boolean;
};

export type Callback<P = void, R = void> = P extends void
  ? () => R
  : P extends [infer A, ...infer Rest] // tuple args
  ? (...args: [A, ...Rest]) => R
  : P extends [] // array args
  ? (...args: P[]) => R
  : (arg: P) => R;

export type AsyncCallback<P = void, R = Promise<void>> = Callback<P, R>;

export type Extend<Source, Target> = Exclude<Source, keyof Target> & Target;

export type CleanupFunction = Callback;
