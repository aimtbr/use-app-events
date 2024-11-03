import createListenForEvents from './listenForEvents';
import createNotifyEventListeners from './notifyEventListeners';

export type BaseListenForEventsOptions = {
  debug?: boolean;
  scopeKey?: string;
  shouldBeCalledOnce?: boolean;
};

export type BaseNotifyEventListenersOptions = {
  debug?: boolean;
  scopeKey?: string;
};

// TODO: create a separate interface instead of ReturnType
// Note: .once() requires a separate type
export type BaseListenForEvents = ReturnType<typeof createListenForEvents>;

export type BaseNotifyEventListeners = ReturnType<
  typeof createNotifyEventListeners
>;
