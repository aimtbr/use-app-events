import { createMessage } from '$broadcast/api';
import { notifyEventListeners } from '$lib';

enum EventType {
  A = 'event-a',
  B = 'event-b',
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe('notifyEventListeners', () => {
  test('Send an event with a payload', async () => {
    const payload = 'Hi';

    const notifyEventListenersSpy = jest.spyOn(
      await import('$lib/notifyEventListeners'),
      'default'
    );

    notifyEventListeners(EventType.A, payload);

    expect(notifyEventListenersSpy).toHaveBeenCalledTimes(1);
    expect(notifyEventListenersSpy).toHaveBeenCalledWith(EventType.A, payload);
  });

  test('Send an event without a payload', async () => {
    const notifyEventListenersSpy = jest.spyOn(
      await import('$lib/notifyEventListeners'),
      'default'
    );

    notifyEventListeners(EventType.A);

    expect(notifyEventListenersSpy).toHaveBeenCalledTimes(1);
    expect(notifyEventListenersSpy).toHaveBeenCalledWith(EventType.A);
  });

  test('Broadcast events to other browsing contexts', async () => {
    const payload = 'Hi';

    const broadcastMessageSpy = jest.spyOn(
      await import('$broadcast/api/broadcastMessage'),
      'default'
    );

    const notifyEventListenersSpy = jest.spyOn(
      await import('$lib/notifyEventListeners'),
      'default'
    );

    notifyEventListeners(EventType.A);
    notifyEventListeners(EventType.B, payload);

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

    const broadcastMessageSpy = jest.spyOn(
      await import('$broadcast/api/broadcastMessage'),
      'default'
    );

    const notifyEventListenersSpy = jest.spyOn(
      await import('$lib/notifyEventListeners'),
      'default'
    );

    notifyEventListeners(EventType.A, undefined, false);
    notifyEventListeners(EventType.B, payload, false);

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
});