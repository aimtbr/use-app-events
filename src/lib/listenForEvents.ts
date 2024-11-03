import { base_createListenForEvents } from '$base';
import { BaseListenForEvents } from '$base/types';
import { Extend } from '$types';

type ListenForEvents = Extend<
  BaseListenForEvents,
  {
    once: BaseListenForEvents;
  }
>;

const listenForEvents = base_createListenForEvents() as ListenForEvents;

listenForEvents.once = base_createListenForEvents({
  shouldBeCalledOnce: true,
});

export default listenForEvents;
