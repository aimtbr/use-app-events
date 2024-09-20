import { heap, listenForEvents } from '$main';

enum EventType {
  A = 'event-a',
  B = 'event-b',
}

afterEach(() => {
  jest.restoreAllMocks();

  heap.eventListeners = [];
});

describe('listenForEvents', () => {
  test('Listen for an event', async () => {
    const listenForEventsSpy = jest.spyOn(
      await import('$lib/listenForEvents'),
      'default'
    );

    const listenForEventsCallback = () => {};

    listenForEvents(EventType.A, listenForEventsCallback);

    expect(listenForEventsSpy).toHaveBeenCalledTimes(1);
    expect(listenForEventsSpy).toHaveBeenCalledWith(
      EventType.A,
      listenForEventsCallback
    );
  });

  test('Listen for an event group (multiple events)', async () => {
    const listenForEventsSpy = jest.spyOn(
      await import('$lib/listenForEvents'),
      'default'
    );

    const listenForEventsCallback = () => {};

    listenForEvents([EventType.A, EventType.B], listenForEventsCallback);

    expect(listenForEventsSpy).toHaveBeenCalledTimes(1);
    expect(listenForEventsSpy).toHaveBeenCalledWith(
      [EventType.A, EventType.B],
      listenForEventsCallback
    );
  });

  test('Listen and unlisten an event', async () => {
    const listenForEventsSpy = jest.spyOn(
      await import('$lib/listenForEvents'),
      'default'
    );

    const listenForEventsCallback = () => {};

    const unlisten = listenForEvents(EventType.A, listenForEventsCallback);

    const unlistenSpy = jest.fn(unlisten);

    expect(heap.eventListeners).toHaveLength(1);

    unlistenSpy();

    expect(listenForEventsSpy).toHaveBeenCalledTimes(1);
    expect(listenForEventsSpy).toHaveReturned();
    expect(unlistenSpy).toHaveBeenCalledTimes(1);
    expect(heap.eventListeners).toHaveLength(0);
  });

  test('Listen and unlisten an event group', async () => {
    const listenForEventsSpy = jest.spyOn(
      await import('$lib/listenForEvents'),
      'default'
    );

    const listenForEventsCallback = () => {};

    const unlisten = listenForEvents(
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
    listenForEvents(EventType.A, () => {});

    expect(heap.eventListeners).toHaveLength(1);
  });

  test('Multiple listeners are added to a heap', () => {
    listenForEvents([EventType.A, EventType.B], () => {});

    expect(heap.eventListeners).toHaveLength(2);
  });
});
