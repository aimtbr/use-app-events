import { useEffect, useMemo } from 'react';
import { debugMessage, generateId } from '$utils';
import { createListenForEvents } from './listenForEvents';
import { createNotifyEventListeners } from './notifyEventListeners';
import heap from '$lib/heap';
import globalOptions from '$lib/options';

type UseAppEventsProps = {
  debug: boolean;
};

/** Hook for managing application events. */
const useAppEvents = <EventType extends string>(props?: UseAppEventsProps) => {
  const { debug: localDebug } = props ?? {};
  const debug = localDebug ?? globalOptions.debug;

  const scopeKey = useMemo(() => generateId(), []);

  useEffect(() => {
    debugMessage(
      `[INIT](instance ${scopeKey}) Created a new useAppEvents hook instance.`,
      debug
    );

    /** Removes listeners created by this instance from `eventListeners`. */
    const unlistenAll = () => {
      heap.eventListeners = heap.eventListeners.filter(
        (listener) => listener.scopeKey !== scopeKey
      );
    };

    return () => {
      debugMessage(
        `[CLEANUP](instance ${scopeKey}) Destroyed the useAppEvents hook instance.`,
        debug
      );

      unlistenAll();
    };
  }, [scopeKey, debug]);

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
};

export default useAppEvents;
