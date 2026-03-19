export type Listener<Type extends string> = {
  /** Event type the listener is waiting for. */
  eventType: Type;

  /** Function to call on event. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (...args: any[]) => void | Promise<void>;

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

/** Event types used by the service. */
export type ServiceEventType<EventType extends string> = `${EventType}_INIT`;
export type Extend<Source, Target> = Exclude<Source, keyof Target> & Target;

export type CleanupFunction = () => void;
