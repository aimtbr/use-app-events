/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef } from 'react';
import { debugMessage } from '$utils/debugMessage';
import { generateId } from '$utils/generateId';
import { createListenForEvents } from './listenForEvents';
import { createNotifyEventListeners } from './notifyEventListeners';
import heap from '$lib/heap';
import globalOptions from '$lib/options';

type UseAppEventsProps = {
  /** When true, the debug mode will be enabled, resulting in additional logs. */
  debug?: boolean;
};

/** Hook for managing application events. */
const useAppEvents = <EventType extends string>(props?: UseAppEventsProps) => {
  const { debug: localDebug } = props ?? {};
  const debug = localDebug ?? globalOptions.debug;

  const scopeKey = useMemo(() => generateId(), []);
  const deferredCleanupRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancel any deferred cleanup if double-mounted (e.g. in Activity and StrictMode)
  const cancelCleanup = () => {
    if (deferredCleanupRef.current !== null) {
      clearTimeout(deferredCleanupRef.current);
      deferredCleanupRef.current = null;
    }
  };

  useEffect(() => {
    cancelCleanup();

    debugMessage(
      `[INIT](instance ${scopeKey}) Created a new useAppEvents hook instance.`,
      debug,
    );

    /** Removes listeners created by this instance from `eventListeners`. */
    const unlistenAll = () => {
      heap.eventListeners = heap.eventListeners.filter(
        (listener) => listener.scopeKey !== scopeKey,
      );
    };

    return () => {
      debugMessage(
        `[CLEANUP](instance ${scopeKey}) Destroyed the useAppEvents hook instance.`,
        debug,
      );

      // Defer the cleanup (to work around Activity and StrictMode)
      deferredCleanupRef.current = setTimeout(unlistenAll);
    };
  }, [scopeKey, debug]);

  const listenForEvents = useMemo(
    () => createListenForEvents<EventType>({ scopeKey, debug }),
    [scopeKey, debug],
  );

  const notifyEventListeners = useMemo(
    () => createNotifyEventListeners<EventType>({ scopeKey, debug }),
    [scopeKey, debug],
  );

  return {
    listenForEvents,
    notifyEventListeners,
  };
};

export default useAppEvents;
