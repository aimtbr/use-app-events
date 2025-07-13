import { base_createListenForEvents } from '$base/listenForEvents/listenForEvents';
import { type BaseListenForEvents } from '$base/listenForEvents/types';
import { Extend } from '$types';

type ListenForEvents<EventType extends string = string> = Extend<
  BaseListenForEvents<EventType>,
  {
    once: BaseListenForEvents<EventType>;
  }
>;

const listenForEvents = base_createListenForEvents() as ListenForEvents;

listenForEvents.once = base_createListenForEvents({
  shouldBeCalledOnce: true,
});

export default listenForEvents;
