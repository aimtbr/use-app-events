import { broadcastMessage } from '$broadcast';
import options from '$options';
import { createMessage } from '$broadcast/api';
import heap from '$heap';

/** Notify all listeners of the specified event type subscribed via `listenForEvents`. */
function notifyEventListeners<Payload, Type extends string>(
  /** Listeners of this event type will be notified. */
  eventType: Type,
  /** Data to send to listeners of this event type. */
  payload?: Payload,
  /** When false, the event is not sent to other browsing contexts. */
  broadcast?: boolean
): void;

/** Notify all listeners of the specified event types subscribed via `listenForEvents`. */
function notifyEventListeners<Payload, Type extends string>(
  /** Listeners of these event types will be notified. */
  eventTypes: Type[],
  /** Data to send to listeners of these event types. */
  payload?: Payload,
  /** When false, the event is not sent to other browsing contexts. */
  broadcast?: boolean
): void;

function notifyEventListeners<Payload, Type extends string>(
  eventTypeOrTypes: Type | Type[],
  payload?: Payload,
  broadcast: boolean = options.broadcast
): void {
  let eventTypes: Type[];

  const hasMultipleTypes = Array.isArray(eventTypeOrTypes);
  if (hasMultipleTypes) {
    eventTypes = eventTypeOrTypes;
  } else {
    eventTypes = [eventTypeOrTypes];
  }

  eventTypes.forEach((eventType) => {
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
}

export default notifyEventListeners;
