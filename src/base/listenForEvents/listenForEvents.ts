import heap from '$lib/heap';
import { CleanupFunction, Listener } from '$types';
import { debugMessage } from '$utils/debugMessage';
import { generateId } from '$utils/generateId';
import { BaseListenForEvents, BaseListenForEventsOptions } from './types';
import globalOptions from '$lib/options';

/** The `listenForEvents` factory. */
export const base_createListenForEvents = <EventType extends string>(
  options?: BaseListenForEventsOptions
): BaseListenForEvents<EventType> => {
  const { debug: localDebug, scopeKey, shouldBeCalledOnce } = options || {};

  const hasScopeKey = typeof scopeKey === 'string';

  const instanceId = hasScopeKey ? `(instance ${scopeKey})` : '';

  const listenForEvents: BaseListenForEvents<EventType> = function (
    eventTypeOrTypes,
    callback
  ): CleanupFunction {
    const debug = localDebug ?? globalOptions.debug;

    const createdListeners: Listener<EventType>[] = [];
    let eventGroupId: string;
    let eventTypes: EventType[];

    // 1. Make sure eventTypes contains an array of event types
    const hasMultipleTypes = Array.isArray(eventTypeOrTypes);
    if (hasMultipleTypes) {
      eventTypes = eventTypeOrTypes;
      eventGroupId = generateId('event-group-');
    } else {
      eventTypes = [eventTypeOrTypes];
    }

    eventTypes.forEach((eventType) => {
      // 1.1 Find an old duplicate listener
      const duplicateListenerIndex = heap.eventListeners.findIndex(
        (listener) => {
          const isScopeKeyMatch = listener.scopeKey === scopeKey;

          if (hasScopeKey && !isScopeKeyMatch) {
            return false;
          }

          return (
            listener.eventType === eventType &&
            listener.callback.toString() === callback.toString()
          );
        }
      );

      const newListener: Listener<EventType> = {
        eventType,
        callback,
        scopeKey,
        shouldBeCalledOnce,
        eventGroupId,
      };

      // 1.2 If there is a duplicate listener, overwrite it with a new one (in case its dependencies changed).
      const isDuplicateListener = duplicateListenerIndex !== -1;
      if (isDuplicateListener) {
        const duplicateListener = heap.eventListeners[duplicateListenerIndex];

        const extendedListener = {
          ...duplicateListener,
          scopeKey,
          shouldBeCalledOnce,
          callback,
        };

        // DEBUG
        debugMessage(
          `[SUBSCRIPTION]${instanceId} Re-subscribed for the "${eventType}" event type.`,
          debug
        );

        heap.eventListeners = [...heap.eventListeners];
        heap.eventListeners[duplicateListenerIndex] = extendedListener;
      }

      // 1.3 If the listener is unique (non-duplicate), add it right away.
      if (!isDuplicateListener) {
        // DEBUG
        debugMessage(
          `[SUBSCRIPTION]${instanceId} Subscribed for the "${eventType}" event type.`,
          debug
        );

        heap.eventListeners = [...heap.eventListeners, newListener];
      }

      createdListeners.push(newListener);
    });

    const unlisten: CleanupFunction = () => {
      heap.eventListeners = heap.eventListeners.filter(
        (listener) => !createdListeners.includes(listener)
      );
    };

    return unlisten;
  };

  return listenForEvents;
};
