import { broadcastMessage } from '$broadcast';
import { createMessage } from '$broadcast/api';
import heap from '$lib/heap';
import globalOptions from '$lib/options';
import { debugMessage } from '$utils';
import { BaseNotifyEventListenersOptions } from './types';

/** The `notifyEventListeners` factory. */
function createNotifyEventListeners<EventType extends string>(
  options?: BaseNotifyEventListenersOptions
) {
  const { debug: localDebug, scopeKey } = options || {};

  // TODO: move into a separate function
  // TODO: use different functions to generate different types of debug messages?
  const instanceId =
    typeof scopeKey === 'string' ? `(instance ${scopeKey})` : '';

  /** Notify all listeners of the specified event type subscribed via `listenForEvents`. */
  function notifyEventListeners<Payload, Type extends EventType>(
    /** Listeners of this event type will be notified. */
    eventType: Type,
    /** Data to send to listeners of this event type. */
    payload?: Payload,
    /** When false, the event is not sent to other browsing contexts. */
    broadcast?: boolean
  ): void;

  /** Notify all listeners of the specified event types subscribed via `listenForEvents`. */
  function notifyEventListeners<Payload, Type extends EventType>(
    /** Listeners of these event types will be notified. */
    eventTypes: Type[],
    /** Data to send to listeners of these event types. */
    payload?: Payload,
    /** When false, the event is not sent to other browsing contexts. */
    broadcast?: boolean
  ): void;

  function notifyEventListeners<Payload, Type extends EventType>(
    eventTypeOrTypes: Type | Type[],
    payload?: Payload,
    broadcast: boolean = globalOptions.broadcast
  ): void {
    const debug = localDebug ?? globalOptions.debug;

    let eventTypes: Type[];

    const hasMultipleTypes = Array.isArray(eventTypeOrTypes);
    if (hasMultipleTypes) {
      eventTypes = eventTypeOrTypes;
    } else {
      eventTypes = [eventTypeOrTypes];
    }

    eventTypes.forEach((eventType) => {
      // DEBUG
      debugMessage(
        `[EVENT-OCCURRED]${instanceId} Notified listeners of the ${eventType} event type about an event with a payload of type ${typeof payload}.`,
        debug
      );

      const ignoredEventGroups = new Set();

      // 1. Notify the listeners of the specified event type
      heap.eventListeners.forEach((listener) => {
        if (listener.eventType === eventType) {
          const isEventGroupIgnoredAlready = ignoredEventGroups.has(
            listener.eventGroupId
          );

          const isEventIgnoredAlready =
            listener.shouldBeCalledOnce && listener.hasBeenCalled;

          const shouldBeIgnored =
            isEventGroupIgnoredAlready || isEventIgnoredAlready;

          if (shouldBeIgnored) {
            return;
          }

          listener.hasBeenCalled = true;

          // If the listener is a part of event group (listenForEvents called with an array)
          if (listener.eventGroupId) {
            // If the listener is a part of an event group and should be called shouldBeCalledOnce
            // Then only one event of this event group can be called
            if (listener.shouldBeCalledOnce) {
              ignoredEventGroups.add(listener.eventGroupId);
            }

            return void listener.callback(eventType, payload);
          }

          return void listener.callback(payload);
        }
      });

      // 2. Mark event groups as called, after any of their events should be and has been called once
      heap.eventListeners.forEach((listener) => {
        const shouldBeCalledOnce =
          listener.shouldBeCalledOnce &&
          listener.eventGroupId &&
          ignoredEventGroups.has(listener.eventGroupId);

        if (shouldBeCalledOnce) {
          listener.hasBeenCalled = true;
        }
      });

      // 3. Broadcast the occurred event to other browsing contexts.
      if (broadcast) {
        broadcastMessage(createMessage(eventType, payload));
      }
    });
  }

  return notifyEventListeners;
}

export default createNotifyEventListeners;
