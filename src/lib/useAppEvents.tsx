import { useCallback, useEffect, useMemo } from 'react';
import { CleanupFunction, Listener, UseAppEventsReturn } from '$types';
import { debugMessage, generateId } from '$utils';
import heap from '$heap';
import { broadcastMessage } from '$broadcast';
import { createMessage } from '$broadcast/api';
import options from '$options';

type UseAppEventsProps = {
  debug: boolean;
};

/** Hook for managing application events. */
function useAppEvents<EventType extends string>(
  props?: UseAppEventsProps
): UseAppEventsReturn<EventType> {
  const { debug = false } = props ?? {};

  const callerId = useMemo(() => generateId(), []);

  useEffect(() => {
    debugMessage(
      `[INIT](instance ${callerId}) Created a new useAppEvents hook instance.`,
      debug
    );

    /** Removes listeners created by this instance from `eventListeners`. */
    const removeInstanceListeners = () => {
      heap.eventListeners = heap.eventListeners.filter(
        (listener) => listener.callerId !== callerId
      );
    };

    return () => {
      debugMessage(
        `[CLEANUP](instance ${callerId}) Destroyed the useAppEvents hook instance.`,
        debug
      );

      removeInstanceListeners();
    };
  }, [callerId]);

  const listenForEvents: UseAppEventsReturn<EventType>['listenForEvents'] =
    useCallback(
      (eventTypeOrTypes, callback) => {
        const createdListeners: Listener<EventType>[] = [];
        let eventTypes: EventType[];

        // 1. Make sure eventTypes contains an array of event types
        const hasMultipleTypes = Array.isArray(eventTypeOrTypes);
        if (hasMultipleTypes) {
          eventTypes = eventTypeOrTypes;
        } else {
          eventTypes = [eventTypeOrTypes];
        }

        eventTypes.forEach((eventType) => {
          // 1.1 Find an old duplicate listener
          const duplicateListenerIndex = heap.eventListeners.findIndex(
            (listener) =>
              listener.callerId === callerId &&
              listener.eventType === eventType &&
              listener.callback.toString() === callback.toString()
          );

          const newListener: Listener<EventType> = {
            eventType,
            callback,
            callerId,
            isEventGroup: hasMultipleTypes,
          };

          // 1.2 If there is a duplicate listener, overwrite it with a new one (in case its dependencies changed).
          const isDuplicateListener = duplicateListenerIndex !== -1;
          if (isDuplicateListener) {
            debugMessage(
              `[SUBSCRIPTION](instance ${callerId}) Re-subscribed for the "${eventType}" event type.`,
              debug
            );

            heap.eventListeners = [...heap.eventListeners];
            heap.eventListeners[duplicateListenerIndex] = newListener;
          }

          // 1.3 If the listener is unique (non-duplicate), add it right away.
          if (!isDuplicateListener) {
            debugMessage(
              `[SUBSCRIPTION](instance ${callerId}) Subscribed for the "${eventType}" event type.`,
              debug
            );

            heap.eventListeners = [...heap.eventListeners, newListener];
          }

          createdListeners.push(newListener);
        });

        const cleanup: CleanupFunction = () => {
          heap.eventListeners = heap.eventListeners.filter(
            (listener) => !createdListeners.includes(listener)
          );
        };

        return cleanup;
      },
      [callerId]
    );

  const notifyEventListeners: UseAppEventsReturn<EventType>['notifyEventListeners'] =
    useCallback(
      (eventTypeOrTypes, payload, broadcast = options.broadcast) => {
        let eventTypes: EventType[];

        const hasMultipleTypes = Array.isArray(eventTypeOrTypes);
        if (hasMultipleTypes) {
          eventTypes = eventTypeOrTypes;
        } else {
          eventTypes = [eventTypeOrTypes];
        }

        eventTypes.forEach((eventType) => {
          debugMessage(
            `[EVENT-OCCURRED](instance ${callerId}) Notified listeners of the ${eventType} event type about an event with a payload of type ${typeof payload}.`,
            debug
          );

          // Notify the listeners of the specified event type
          heap.eventListeners.forEach((listener) => {
            if (listener.eventType === eventType) {
              // If the listener is a part of event group (listenForEvents called with an array)
              if (listener.isEventGroup) {
                return listener.callback(eventType, payload);
              }

              listener.callback(payload);
            }
          });

          // Broadcast the occurred event to other browsing contexts.
          if (broadcast) {
            broadcastMessage(createMessage(eventType, payload));
          }
        });
      },
      [callerId]
    );

  return {
    listenForEvents,
    notifyEventListeners,
  };
}

export default useAppEvents;
