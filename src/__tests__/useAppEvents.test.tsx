import { useAppEvents } from '$lib/useAppEvents';
import { renderHook, screen } from '@testing-library/react';

beforeAll(() => {
  screen.debug();
});

describe('useAppEvents', () => {
  test('Successfully send a single event between two useAppEvents instances', () => {
    enum EventType {
      SOME_EVENT = 'some-event',
    }

    const MESSAGE = 'New event!';

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
      EventType.SOME_EVENT,
      listenForEventsCallback
    );

    sender.result.current.notifyEventListeners(EventType.SOME_EVENT, MESSAGE);

    expect(notifyEventListenersSpy).toHaveBeenCalledWith(
      EventType.SOME_EVENT,
      MESSAGE
    );
    expect(listenForEventsSpy).toHaveBeenCalledWith(
      EventType.SOME_EVENT,
      listenForEventsCallback
    );
    expect(listenForEventsCallback).toHaveBeenCalledWith(MESSAGE);
  });
});
