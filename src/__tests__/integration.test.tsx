import { heap, listenForEvents, notifyEventListeners, options } from '$main';

enum EventType {
  A = 'event-a',
  B = 'event-b',
  C = 'event-c',
  D = 'event-d',
}

describe('Integration tests', () => {
  test('Send an event from one instance to another', async () => {
    const message = 'New event!';

    const notifyEventListenersSpy = jest.spyOn(
      await import('$lib/notifyEventListeners'),
      'default'
    );
    const listenForEventsSpy = jest.spyOn(
      await import('$lib/listenForEvents'),
      'default'
    );
    const listenForEventsCallback = jest.fn();

    listenForEvents(EventType.A, listenForEventsCallback);

    notifyEventListeners(EventType.A, message);

    expect(notifyEventListenersSpy).toHaveBeenCalledWith(EventType.A, message);
    expect(listenForEventsSpy).toHaveBeenCalledWith(
      EventType.A,
      listenForEventsCallback
    );
    expect(listenForEventsCallback).toHaveBeenCalledWith(message);
  });

  test('Send an event to the listener of a specific event type', async () => {
    const message = 'New event!';

    const spyNotifyEventListeners = jest.spyOn(
      await import('$lib/notifyEventListeners'),
      'default'
    );

    const spyListenForEventA = jest.spyOn(
      await import('$lib/listenForEvents'),
      'default'
    );

    const spyListenForEventB = jest.spyOn(
      await import('$lib/listenForEvents'),
      'default'
    );
    const mockListenForEventACallback = jest.fn();
    const mockListenForEventBCallback = jest.fn();

    // Recipient A is listening for event A
    listenForEvents(EventType.A, mockListenForEventACallback);
    // Recipient B is listening for event B
    listenForEvents(EventType.B, mockListenForEventBCallback);

    notifyEventListeners(EventType.B, message);

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

    const listenForEventsCallback = jest.fn();

    // Listen for 3 events at once
    listenForEvents(listenedEventGroup, listenForEventsCallback);

    // Send 4 events
    notifyEventListeners(EventType.A, messageA);
    notifyEventListeners(EventType.B, messageB);
    notifyEventListeners(EventType.C, messageC);
    // Send an event that no one is listening for
    notifyEventListeners(EventType.D);

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

  test('Listen for an event once', () => {
    const firstPayload = 'Hello';
    const secondPayload = 'Bye';

    const listenForEventsCallback = jest.fn();

    listenForEvents.once(EventType.A, listenForEventsCallback);

    notifyEventListeners(EventType.A, firstPayload);
    // The second event should not be processed
    notifyEventListeners(EventType.A, secondPayload);

    expect(heap.eventListeners).toHaveLength(1);
    expect(heap.eventListeners[0]).toHaveProperty('shouldBeCalledOnce', true);
    expect(listenForEventsCallback).toHaveBeenCalledTimes(1);
    expect(listenForEventsCallback).toHaveBeenCalledWith(firstPayload);
  });

  test('Listen for events once', () => {
    const firstPayload = 'Hello';
    const secondPayload = 'Bye';

    const listenForEventsCallback = jest.fn();

    listenForEvents.once([EventType.A, EventType.B], listenForEventsCallback);

    notifyEventListeners(EventType.A, firstPayload);
    // The second event should not be processed
    notifyEventListeners(EventType.B, secondPayload);

    expect(heap.eventListeners).toHaveLength(2);
    expect(heap.eventListeners[0]).toHaveProperty('shouldBeCalledOnce', true);
    expect(heap.eventListeners[1]).toHaveProperty('shouldBeCalledOnce', true);
    expect(heap.eventListeners[0]).toHaveProperty('hasBeenCalled', true);
    expect(heap.eventListeners[1]).toHaveProperty('hasBeenCalled', true);
    expect(heap.eventListeners[0].eventGroupId).toBe(
      heap.eventListeners[1].eventGroupId
    );
    expect(listenForEventsCallback).toHaveBeenCalledTimes(1);
    expect(listenForEventsCallback).toHaveBeenCalledWith(
      EventType.A,
      firstPayload
    );
  });

  test('Enable debug mode globally', () => {
    const mockConsoleLog = jest.fn();
    console.Console.prototype.log = mockConsoleLog;

    options.debug = true;

    // 1. Subscribe for the event
    listenForEvents(EventType.A, () => {});
    // 2. Re-subscribe for the event
    listenForEvents(EventType.A, () => {});
    // 3. Send an event
    notifyEventListeners(EventType.A);

    expect(mockConsoleLog).toHaveBeenCalledTimes(3);
  });

  test('Disable debug mode globally', () => {
    const mockConsoleLog = jest.fn();
    console.Console.prototype.log = mockConsoleLog;

    options.debug = false;

    // 1. Subscribe for the event
    listenForEvents(EventType.A, () => {});
    // 2. Re-subscribe for the event
    listenForEvents(EventType.A, () => {});
    // 3. Send an event
    notifyEventListeners(EventType.A);

    expect(mockConsoleLog).toHaveBeenCalledTimes(0);
  });
});
