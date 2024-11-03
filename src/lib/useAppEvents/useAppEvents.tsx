import { useEffect, useMemo } from 'react';
import { debugMessage, generateId } from '$utils';
import { createListenForEvents } from './listenForEvents';
import { createNotifyEventListeners } from './notifyEventListeners';
import heap from '$lib/heap';

type UseAppEventsProps = {
  debug: boolean;
};

/** Hook for managing application events. */
function useAppEvents<EventType extends string>(props?: UseAppEventsProps) {
  const { debug } = props ?? {};

  const scopeKey = useMemo(() => generateId(), []);

  useEffect(() => {
    debugMessage(
      `[INIT](instance ${scopeKey}) Created a new useAppEvents hook instance.`,
      debug
    );

    /** Removes listeners created by this instance from `eventListeners`. */
    const removeInstanceListeners = () => {
      heap.eventListeners = heap.eventListeners.filter(
        (listener) => listener.scopeKey !== scopeKey
      );
    };

    return () => {
      debugMessage(
        `[CLEANUP](instance ${scopeKey}) Destroyed the useAppEvents hook instance.`,
        debug
      );

      removeInstanceListeners();
    };
  }, [scopeKey, debug]);

  // TODO: call unlistenAll on unmount?
  const listenForEvents = useMemo(
    () => createListenForEvents<EventType>({ scopeKey, debug }),
    [scopeKey, debug]
  );

  const notifyEventListeners = useMemo(
    () => createNotifyEventListeners<EventType>({ scopeKey, debug }),
    [scopeKey, debug]
  );

  return {
    listenForEvents,
    notifyEventListeners,
  };
}

export default useAppEvents;
