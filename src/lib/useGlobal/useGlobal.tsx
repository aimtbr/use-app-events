import { useEffect, useMemo, useRef, useState } from 'react';
import { debugMessage } from '$utils/debugMessage';
import { generateId } from '$utils/generateId';
import globalOptions from '$lib/options';
import useAppEvents from '$lib/useAppEvents/useAppEvents';
import { ServiceEventType } from '$types';
import { UpdateValueAction, UseGlobalHook, UseGlobalOptions } from './types';

/** Hook for managing a global variable. */
const useGlobal: UseGlobalHook = <Value, EventType extends string = string>(
  eventType: EventType,
  initialValue?: Value,
  options?: UseGlobalOptions,
) => {
  const { debug: localDebug, synchronize = true } = options ?? {};
  const debug = localDebug ?? globalOptions.debug;

  const scopeKey = useMemo(() => generateId(), []);

  const [value, setValue] = useState<Value | undefined>(initialValue);

  // Reference to the latest value
  // Note: no need to add it as a dependency to any useEffect unlike `value` which would trigger the effect on every `value` change
  const valueRef = useRef(value);
  valueRef.current = value;

  const { listenForEvents, notifyEventListeners } = useAppEvents<
    EventType | ServiceEventType<EventType>
  >({
    debug,
  });

  // Update the value across all instances of this hook
  const updateValue: UpdateValueAction<Value> = (nextValue) => {
    const isFunction = nextValue instanceof Function;
    const isObject =
      typeof nextValue === 'object' &&
      Object.prototype.toString.call(nextValue) === '[object Object]';

    setValue((prevValue) => {
      let value: Value | undefined;

      if (!isFunction) {
        value = nextValue as Value;
      }

      if (isFunction) {
        value = (nextValue as (prevValue: Value | undefined) => Value)(
          prevValue,
        );
      }

      if (isObject) {
        value = { ...prevValue, ...nextValue } as Value;
      }

      notifyEventListeners(eventType, value);

      return value;
    });
  };

  // Effect: on event type change
  useEffect(() => {
    const cleanups: VoidFunction[] = [];

    // Subscribe for changes of this event type from other instances
    // of the hook and synchronize the value across all instances
    cleanups.push(
      listenForEvents(eventType, (nextValue: Value) => {
        setValue(nextValue);
      }),
    );

    // Listen for the new instances of this hook requesting the latest value
    cleanups.push(
      listenForEvents(`${eventType}_INIT`, (requesterScopeKey: string) => {
        // Skip responding to our own INIT request
        const isSameInstance = requesterScopeKey === scopeKey;
        if (isSameInstance) return;

        // Send the latest value to the new instances
        notifyEventListeners(eventType, valueRef.current);
      }),
    );

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventType]);

  // Effect: on mount and unmount
  useEffect(() => {
    debugMessage(
      `[INIT](instance ${scopeKey}) Created a new useGlobal hook instance.`,
      debug,
    );

    if (synchronize) {
      // Request the latest value from the older instances of this hook
      notifyEventListeners(`${eventType}_INIT`, scopeKey);
    }

    return () => {
      debugMessage(
        `[CLEANUP](instance ${scopeKey}) Destroyed the useGlobal hook instance.`,
        debug,
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [value, updateValue] as const;
};

export default useGlobal;
