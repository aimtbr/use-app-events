import { useCallback, useEffect, useId } from 'react';
import { Listener, UseAppEventsReturn } from '$types';
import { debugMessage } from '$utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let eventListeners: Listener<any>[] = [];

type UseAppEventsProps = {
  debug?: boolean;
};

/** Hook for managing application events. */
export function useAppEvents<EventType extends string>(
  props?: UseAppEventsProps
): UseAppEventsReturn<EventType> {
  const { debug = false } = props ?? {};

  const instanceId = useId();

  useEffect(() => {
    /** Removes listeners created by this instance from `eventListeners`. */
    const removeInstanceListeners = () => {
      eventListeners = eventListeners.filter(
        (listener) => listener.instanceId !== instanceId
      );
    };

    return () => {
      debugMessage(
        `[CLEANUP](instance ${instanceId}) Destroyed the useAppEvents hook instance.`,
        debug
      );

      removeInstanceListeners();
    };
  }, [instanceId]);

  const listenForEvents: UseAppEventsReturn<EventType>['listenForEvents'] =
    useCallback(
      (eventType, callback) => {
        // 1. Find an old duplicate listener
        const duplicateListenerIndex = eventListeners.findIndex(
          (listener) =>
            listener.instanceId === instanceId &&
            listener.eventType === eventType &&
            listener.callback.toString() === callback.toString()
        );

        const newListener = { eventType, callback, instanceId };

        // 2. If there is a duplicate listener, overwrite it with a new one (in case its dependencies changed).
        const isDuplicateListener = duplicateListenerIndex !== -1;
        if (isDuplicateListener) {
          debugMessage(
            `[SUBSCRIPTION](instance ${instanceId}) Re-subscribed for the ${eventType} event type.`,
            debug
          );

          eventListeners = eventListeners.with(
            duplicateListenerIndex,
            newListener
          );
        }

        // 2.1 If the listener is unique (non-duplicate), add it right away.
        if (!isDuplicateListener) {
          debugMessage(
            `[SUBSCRIPTION](instance ${instanceId}) Subscribed for the ${eventType} event type.`,
            debug
          );

          eventListeners = [...eventListeners, newListener];
        }
      },
      [instanceId]
    );

  const notifyEventListeners: UseAppEventsReturn<EventType>['notifyEventListeners'] =
    useCallback(
      (eventType, payload) => {
        debugMessage(
          `[EVENT-OCCURRED](instance ${instanceId}) Notified listeners of the ${eventType} event type about an event with a payload of type ${typeof payload}.`,
          debug
        );

        eventListeners.forEach((listener) => {
          if (listener.eventType === eventType) {
            listener.callback(payload);
          }
        });
      },
      [instanceId]
    );

  return {
    listenForEvents,
    notifyEventListeners,
  };
}
