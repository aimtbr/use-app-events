import { listenForEvents } from '$lib';

enum EventType {
  A = 'event-a',
  B = 'event-b',
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe('listenForEvents', () => {
  test('Subscribe and listen for an event', async () => {
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

  test('Subscribe and listen for an event group (multiple events)', async () => {
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
});
