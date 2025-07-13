import { AsyncCallback, Callback, CleanupFunction } from '$types';

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
      | Callback<void>
      | Callback<Payload>
      | AsyncCallback<void>
      | AsyncCallback<Payload>
  ): CleanupFunction;

  /** Subscribe and listen for the specified event types to occur in the app. */
  <Type extends EventType, Payload>(
    eventTypes: Type[],
    callback:
      | Callback<void>
      | Callback<[Type, Payload]>
      | AsyncCallback<void>
      | AsyncCallback<[Type, Payload]>
  ): CleanupFunction;
};
