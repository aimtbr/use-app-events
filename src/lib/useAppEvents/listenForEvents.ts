import { type BaseListenForEvents } from '$base/listenForEvents/types';
import { base_createListenForEvents } from '$base/listenForEvents/listenForEvents';
import { Extend } from '$types';

type ListenForEvents<EventType extends string> = Extend<
  BaseListenForEvents<EventType>,
  {
    once: BaseListenForEvents<EventType>;
  }
>;

const createListenForEvents = <EventType extends string>(
  ...args: Parameters<typeof base_createListenForEvents>
) => {
  const listenForEvents = base_createListenForEvents<EventType>(
    ...args
  ) as ListenForEvents<EventType>;

  listenForEvents.once = base_createListenForEvents<EventType>({
    shouldBeCalledOnce: true,
    ...args[0],
  });

  return listenForEvents;
};

export { createListenForEvents };
