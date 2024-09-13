import { broadcastMessage } from '$broadcast';
import options from '$options';
import { createMessage } from '$broadcast/api';
import heap from '$heap';

/** Notify all listeners of the specified event type subscribed via `listenForEvents`. */
const notifyEventListeners = <Payload, Type extends string>(
  eventType: Type,
  payload?: Payload,
  /** When false, the event is not sent to other browsing contexts. */
  broadcast: boolean = options.broadcast
): void => {
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
};

export default notifyEventListeners;
