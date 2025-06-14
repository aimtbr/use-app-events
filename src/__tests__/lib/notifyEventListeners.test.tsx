import { createMessage } from '$broadcast/api';
import { notifyEventListeners, options } from '$main';

enum EventType {
  A = 'event-a',
  B = 'event-b',
}

describe('notifyEventListeners', () => {
  afterEach(() => {
    options.reset();
  });

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

  test('Send multiple events with a payload', async () => {
    const payload = 'Hi';

    const notifyEventListenersSpy = jest.spyOn(
      await import('$lib/notifyEventListeners'),
      'default'
    );

    notifyEventListeners([EventType.A, EventType.B], payload);

    expect(notifyEventListenersSpy).toHaveBeenCalledTimes(1);
    expect(notifyEventListenersSpy).toHaveBeenCalledWith(
      [EventType.A, EventType.B],
      payload
    );
  });

  test('Send multiple events without a payload', async () => {
    const notifyEventListenersSpy = jest.spyOn(
      await import('$lib/notifyEventListeners'),
      'default'
    );

    notifyEventListeners([EventType.A, EventType.B]);

    expect(notifyEventListenersSpy).toHaveBeenCalledTimes(1);
    expect(notifyEventListenersSpy).toHaveBeenCalledWith([
      EventType.A,
      EventType.B,
    ]);
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
    notifyEventListeners([EventType.A, EventType.B]);
    notifyEventListeners([EventType.A, EventType.B], payload);

    expect(notifyEventListenersSpy).toHaveBeenCalledTimes(4);
    expect(notifyEventListenersSpy).toHaveBeenCalledWith(EventType.A);
    expect(notifyEventListenersSpy).toHaveBeenCalledWith(EventType.B, payload);
    expect(notifyEventListenersSpy).toHaveBeenCalledWith([
      EventType.A,
      EventType.B,
    ]);
    expect(notifyEventListenersSpy).toHaveBeenCalledWith(
      [EventType.A, EventType.B],
      payload
    );

    expect(broadcastMessageSpy).toHaveBeenCalledTimes(6);
    expect(broadcastMessageSpy).toHaveBeenNthCalledWith(
      1,
      createMessage(EventType.A)
    );
    expect(broadcastMessageSpy).toHaveBeenNthCalledWith(
      2,
      createMessage(EventType.B, payload)
    );
    expect(broadcastMessageSpy).toHaveBeenNthCalledWith(
      3,
      createMessage(EventType.A)
    );
    expect(broadcastMessageSpy).toHaveBeenNthCalledWith(
      4,
      createMessage(EventType.B)
    );
    expect(broadcastMessageSpy).toHaveBeenNthCalledWith(
      5,
      createMessage(EventType.A, payload)
    );
    expect(broadcastMessageSpy).toHaveBeenNthCalledWith(
      6,
      createMessage(EventType.B, payload)
    );
  });

  test('Do not broadcast events to other browsing contexts selectively', async () => {
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
    notifyEventListeners([EventType.A, EventType.B], payload, false);

    expect(notifyEventListenersSpy).toHaveBeenCalledTimes(3);
    expect(notifyEventListenersSpy).toHaveBeenNthCalledWith(
      1,
      EventType.A,
      undefined,
      false
    );
    expect(notifyEventListenersSpy).toHaveBeenNthCalledWith(
      2,
      EventType.B,
      payload,
      false
    );
    expect(notifyEventListenersSpy).toHaveBeenNthCalledWith(
      3,
      [EventType.A, EventType.B],
      payload,
      false
    );

    expect(broadcastMessageSpy).not.toHaveBeenCalled();
  });

  test('Do not broadcast events to other browsing contexts entirely', async () => {
    const payload = 'Hi';

    const broadcastMessageSpy = jest.spyOn(
      await import('$broadcast/api/broadcastMessage'),
      'default'
    );

    const notifyEventListenersSpy = jest.spyOn(
      await import('$lib/notifyEventListeners'),
      'default'
    );

    options.broadcast = false;

    notifyEventListeners(EventType.A, undefined);
    notifyEventListeners(EventType.B, payload);
    notifyEventListeners([EventType.A, EventType.B], payload);

    expect(notifyEventListenersSpy).toHaveBeenCalledTimes(3);
    expect(notifyEventListenersSpy).toHaveBeenNthCalledWith(
      1,
      EventType.A,
      undefined
    );
    expect(notifyEventListenersSpy).toHaveBeenNthCalledWith(
      2,
      EventType.B,
      payload
    );
    expect(notifyEventListenersSpy).toHaveBeenNthCalledWith(
      3,
      [EventType.A, EventType.B],
      payload
    );

    expect(broadcastMessageSpy).not.toHaveBeenCalled();
  });
});
