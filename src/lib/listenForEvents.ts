import heap from '$heap';
import { Callback, Listener } from '$types';

/** Subscribe and listen for the specified event type to occur in the app. */
function listenForEvents<Type extends string, Payload>(
  eventType: Type,
  callback: Callback<void> | Callback<Payload>
): void;

/** Subscribe and listen for the specified event types to occur in the app. */
function listenForEvents<Type extends string, Payload>(
  eventGroup: Type[],
  callback: Callback<void> | Callback<Type> | Callback<[Type, Payload]>
): void;

function listenForEvents<Type extends string, Payload>(
  eventTypeOrGroup: Type | Type[],
  callback:
    | Callback<void>
    | Callback<Payload>
    | Callback<Type>
    | Callback<[Type, Payload]>
) {
  let eventGroup: Type[];

  const isEventGroup = Array.isArray(eventTypeOrGroup);
  // 1. If eventTypeOrGroup is not an array (not a group), make it a group
  if (isEventGroup) {
    eventGroup = eventTypeOrGroup;
  } else {
    eventGroup = [eventTypeOrGroup];
  }

  eventGroup.forEach((eventType) => {
    // 1.1 Find an old duplicate listener
    const duplicateListenerIndex = heap.eventListeners.findIndex(
      (listener) =>
        listener.eventType === eventType &&
        listener.callback.toString() === callback.toString()
    );

    const newListener: Listener<Type> = {
      eventType,
      callback,
      isEventGroup,
    };

    // 1.2 If there is a duplicate listener, overwrite it with a new one (in case its dependencies changed).
    const isDuplicateListener = duplicateListenerIndex !== -1;
    if (isDuplicateListener) {
      heap.eventListeners = heap.eventListeners.with(
        duplicateListenerIndex,
        newListener
      );
    }

    // 1.3 If the listener is unique (non-duplicate), add it right away.
    if (!isDuplicateListener) {
      heap.eventListeners = [...heap.eventListeners, newListener];
    }
  });
}

export default listenForEvents;