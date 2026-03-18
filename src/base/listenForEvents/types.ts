import { CleanupFunction } from '$types';

export type BaseListenForEventsOptions = {
  debug?: boolean;
  scopeKey?: string;
  shouldBeCalledOnce?: boolean;
};

export type BaseListenForEvents<EventType extends string> = {
  /** Subscribe and listen for the specified event type to occur in the app. */
  <Type extends EventType, Payload>(
    eventType: Type,
    callback:
      | (() => void)
      | ((arg: Payload) => void)
      | (() => Promise<void>)
      | ((arg: Payload) => Promise<void>),
  ): CleanupFunction;

  /** Subscribe and listen for the specified event types to occur in the app. */
  <Type extends EventType, Payload>(
    eventTypes: Type[],
    callback:
      | (() => void)
      | ((...args: [Type, Payload]) => void)
      | (() => Promise<void>)
      | ((...args: [Type, Payload]) => Promise<void>),
  ): CleanupFunction;
};
