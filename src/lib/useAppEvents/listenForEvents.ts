import { base_createListenForEvents } from '$base';
import { BaseListenForEvents } from '$base/types';
import { Extend } from '$types';

type ListenForEvents = Extend<
  BaseListenForEvents,
  {
    once: BaseListenForEvents;
  }
>;

const createListenForEvents = <EventType extends string>(
  ...args: Parameters<typeof base_createListenForEvents>
) => {
  const listenForEvents = base_createListenForEvents<EventType>(
    ...args
  ) as ListenForEvents;

  listenForEvents.once = base_createListenForEvents<EventType>({
    shouldBeCalledOnce: true,
    ...args[0],
  });

  return listenForEvents;
};

export { createListenForEvents };
