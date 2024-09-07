import { createMessage } from '$broadcast/api';
import { heap, useAppEvents } from '$lib';
import { renderHook } from '@testing-library/react';

enum EventType {
  A = 'event-a',
  B = 'event-b',
  C = 'event-c',
  D = 'event-d',
}

afterEach(() => {
  jest.restoreAllMocks();

  heap.eventListeners = [];
});

describe('useAppEvents', () => {
  test('Send an event', () => {
    const message = 'New event!';

    const sender = renderHook(() => useAppEvents<EventType>());

    const notifyEventListenersSpy = jest.spyOn(
      sender.result.current,
      'notifyEventListeners'
    );

    sender.result.current.notifyEventListeners(EventType.A, message);

    expect(notifyEventListenersSpy).toHaveBeenCalledWith(EventType.A, message);
  });

  test('Listen for an event', () => {
    const recipient = renderHook(() => useAppEvents<EventType>());

    const listenForEventsSpy = jest.spyOn(
      recipient.result.current,
      'listenForEvents'
    );
    const listenForEventsCallback = jest.fn();

    recipient.result.current.listenForEvents(
      EventType.A,
      listenForEventsCallback
    );

    expect(listenForEventsSpy).toHaveBeenCalledWith(
      EventType.A,
      listenForEventsCallback
    );
    expect(listenForEventsCallback).not.toHaveBeenCalled();
  });

  test('Send an event from one instance to another', () => {
    const message = 'New event!';

    const sender = renderHook(() => useAppEvents<EventType>());
    const recipient = renderHook(() => useAppEvents<EventType>());

    const notifyEventListenersSpy = jest.spyOn(
      sender.result.current,
      'notifyEventListeners'
    );
    const listenForEventsSpy = jest.spyOn(
      recipient.result.current,
      'listenForEvents'
    );
    const listenForEventsCallback = jest.fn();

    recipient.result.current.listenForEvents(
      EventType.A,
      listenForEventsCallback
    );

    sender.result.current.notifyEventListeners(EventType.A, message);

    expect(notifyEventListenersSpy).toHaveBeenCalledWith(EventType.A, message);
    expect(listenForEventsSpy).toHaveBeenCalledWith(
      EventType.A,
      listenForEventsCallback
    );
    expect(listenForEventsCallback).toHaveBeenCalledWith(message);
  });

  test('Send an event to the listener of a specific event type', () => {
    const message = 'New event!';

    const sender = renderHook(() => useAppEvents<EventType>());
    const recipientA = renderHook(() => useAppEvents<EventType>());
    const recipientB = renderHook(() => useAppEvents<EventType>());

    const spyNotifyEventListeners = jest.spyOn(
      sender.result.current,
      'notifyEventListeners'
    );

    const spyListenForEventA = jest.spyOn(
      recipientA.result.current,
      'listenForEvents'
    );

    const spyListenForEventB = jest.spyOn(
      recipientB.result.current,
      'listenForEvents'
    );
    const mockListenForEventACallback = jest.fn();
    const mockListenForEventBCallback = jest.fn();

    // Recipient A is listening for event A
    recipientA.result.current.listenForEvents(
      EventType.A,
      mockListenForEventACallback
    );
    // Recipient B is listening for event B
    recipientB.result.current.listenForEvents(
      EventType.B,
      mockListenForEventBCallback
    );

    sender.result.current.notifyEventListeners(EventType.B, message);

    // Test if Sender successfully sent event B
    expect(spyNotifyEventListeners).toHaveBeenCalledWith(EventType.B, message);

    // Test if Recipient A successfully subscribed for event A
    expect(spyListenForEventA).toHaveBeenCalledWith(
      EventType.A,
      mockListenForEventACallback
    );

    // Test if Recipient A didn't receive any event
    expect(mockListenForEventACallback).not.toHaveBeenCalled();

    // Test if Recipient B successfully subscribed for event B
    expect(spyListenForEventB).toHaveBeenCalledWith(
      EventType.B,
      mockListenForEventBCallback
    );

    // Test if Recipient B successfully received and processed event B
    expect(mockListenForEventBCallback).toHaveBeenCalledWith(message);
  });

  test('Listen for an event group (multiple events)', () => {
    const messageA = 'New event A!';
    const messageB = 'New event B!';
    const messageC = 'New event C!';

    const listenedEventGroup: EventType[] = [
      EventType.A,
      EventType.B,
      EventType.C,
    ];

    const sender = renderHook(() => useAppEvents<EventType>());
    const recipient = renderHook(() => useAppEvents<EventType>());

    const listenForEventsSpy = jest.spyOn(
      recipient.result.current,
      'listenForEvents'
    );
    const listenForEventsCallback = jest.fn();

    // Listen for 3 events at once
    recipient.result.current.listenForEvents(
      listenedEventGroup,
      listenForEventsCallback
    );

    // Send 4 events
    sender.result.current.notifyEventListeners(EventType.A, messageA);
    sender.result.current.notifyEventListeners(EventType.B, messageB);
    sender.result.current.notifyEventListeners(EventType.C, messageC);
    // Send an event that no one is listening for.
    sender.result.current.notifyEventListeners(EventType.D);

    expect(listenForEventsSpy).toHaveBeenCalledWith(
      listenedEventGroup,
      listenForEventsCallback
    );
    expect(listenForEventsCallback).toHaveBeenCalledTimes(3);
    expect(listenForEventsCallback).toHaveBeenNthCalledWith(
      1,
      EventType.A,
      messageA
    );
    expect(listenForEventsCallback).toHaveBeenNthCalledWith(
      2,
      EventType.B,
      messageB
    );
    expect(listenForEventsCallback).toHaveBeenNthCalledWith(
      3,
      EventType.C,
      messageC
    );
  });

  test('Send an event without a payload', () => {
    const sender = renderHook(() => useAppEvents<EventType>());
    const recipient = renderHook(() => useAppEvents<EventType>());

    const notifyEventListenersSpy = jest.spyOn(
      sender.result.current,
      'notifyEventListeners'
    );
    const listenForEventsSpy = jest.spyOn(
      recipient.result.current,
      'listenForEvents'
    );
    const listenForEventsCallback = jest.fn();

    recipient.result.current.listenForEvents(
      EventType.A,
      listenForEventsCallback
    );

    sender.result.current.notifyEventListeners(EventType.A);

    expect(listenForEventsSpy).toHaveBeenCalledWith(
      EventType.A,
      listenForEventsCallback
    );
    expect(notifyEventListenersSpy).toHaveBeenCalledWith(EventType.A);
    expect(listenForEventsCallback).toHaveBeenCalledWith(undefined);
  });

  test('Enable debug mode', async () => {
    const mockDebugMessage = jest.spyOn(
      await import('$utils/debugMessage'),
      'default'
    );

    const instance = renderHook(() => useAppEvents<EventType>({ debug: true }));

    // 2. Subscribe for the event
    instance.result.current.listenForEvents(EventType.A, () => {});
    // 3. Re-subscribe for the event
    instance.result.current.listenForEvents(EventType.A, () => {});

    // 4. Send an event
    instance.result.current.notifyEventListeners(EventType.A);

    // 5. Unmount the hook
    instance.unmount();

    expect(mockDebugMessage).toHaveBeenCalledTimes(5);
  });

  test('Overwrite the duplicated listeners', () => {
    const instance = renderHook(() => useAppEvents<EventType>());

    instance.result.current.listenForEvents(EventType.A, () => {});

    instance.result.current.listenForEvents(EventType.A, () => {});

    expect(heap.eventListeners).toHaveLength(1);
  });

  test('Broadcast events to other browsing contexts', async () => {
    const payload = 'Hi';

    const sender = renderHook(() => useAppEvents<EventType>());

    const broadcastMessageSpy = jest.spyOn(
      await import('$broadcast/api/broadcastMessage'),
      'default'
    );

    const notifyEventListenersSpy = jest.spyOn(
      sender.result.current,
      'notifyEventListeners'
    );

    sender.result.current.notifyEventListeners(EventType.A);
    sender.result.current.notifyEventListeners(EventType.B, payload);

    expect(notifyEventListenersSpy).toHaveBeenCalledTimes(2);
    expect(notifyEventListenersSpy).toHaveBeenCalledWith(EventType.A);
    expect(notifyEventListenersSpy).toHaveBeenCalledWith(EventType.B, payload);

    expect(broadcastMessageSpy).toHaveBeenCalledTimes(2);
    expect(broadcastMessageSpy).toHaveBeenNthCalledWith(
      1,
      createMessage(EventType.A)
    );
    expect(broadcastMessageSpy).toHaveBeenNthCalledWith(
      2,
      createMessage(EventType.B, payload)
    );
  });

  test('Do not broadcast events to other browsing contexts', async () => {
    const payload = 'Hi';

    const sender = renderHook(() => useAppEvents<EventType>());

    const broadcastMessageSpy = jest.spyOn(
      await import('$broadcast/api/broadcastMessage'),
      'default'
    );

    const notifyEventListenersSpy = jest.spyOn(
      sender.result.current,
      'notifyEventListeners'
    );

    sender.result.current.notifyEventListeners(EventType.A, undefined, false);
    sender.result.current.notifyEventListeners(EventType.B, payload, false);

    expect(notifyEventListenersSpy).toHaveBeenCalledTimes(2);
    expect(notifyEventListenersSpy).toHaveBeenCalledWith(
      EventType.A,
      undefined,
      false
    );
    expect(notifyEventListenersSpy).toHaveBeenCalledWith(
      EventType.B,
      payload,
      false
    );

    expect(broadcastMessageSpy).not.toHaveBeenCalled();
  });

  test('Listen and unlisten an event', () => {
    const recipient = renderHook(() => useAppEvents<EventType>());

    const listenForEventsSpy = jest.spyOn(
      recipient.result.current,
      'listenForEvents'
    );
    const listenForEventsCallback = () => {};

    const unlisten = recipient.result.current.listenForEvents(
      EventType.A,
      listenForEventsCallback
    );

    const unlistenSpy = jest.fn(unlisten);

    expect(heap.eventListeners).toHaveLength(1);

    unlistenSpy();

    expect(listenForEventsSpy).toHaveBeenCalledTimes(1);
    expect(listenForEventsSpy).toHaveReturned();
    expect(unlistenSpy).toHaveBeenCalledTimes(1);
    expect(heap.eventListeners).toHaveLength(0);
  });

  test('Listen and unlisten an event group', () => {
    const recipient = renderHook(() => useAppEvents<EventType>());

    const listenForEventsSpy = jest.spyOn(
      recipient.result.current,
      'listenForEvents'
    );
    const listenForEventsCallback = () => {};

    const unlisten = recipient.result.current.listenForEvents(
      [EventType.A, EventType.B],
      listenForEventsCallback
    );

    const unlistenSpy = jest.fn(unlisten);

    expect(heap.eventListeners).toHaveLength(2);

    unlistenSpy();

    expect(listenForEventsSpy).toHaveBeenCalledTimes(1);
    expect(listenForEventsSpy).toHaveReturned();
    expect(unlistenSpy).toHaveBeenCalledTimes(1);
    expect(unlistenSpy).toHaveBeenCalledWith();
    expect(heap.eventListeners).toHaveLength(0);
  });

  test('Single listener is added to a heap', () => {
    const recipient = renderHook(() => useAppEvents<EventType>());

    recipient.result.current.listenForEvents(EventType.A, () => {});

    expect(heap.eventListeners).toHaveLength(1);
  });

  test('Multiple listeners are added to a heap', () => {
    const recipient = renderHook(() => useAppEvents<EventType>());

    recipient.result.current.listenForEvents(
      [EventType.A, EventType.B],
      () => {}
    );

    expect(heap.eventListeners).toHaveLength(2);
  });
});
