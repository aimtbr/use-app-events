import { Listener } from '$types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const eventListeners: Listener<any, any>[] = [];

const heap = Object.seal({
  /** The array of listeners used by active `listenForEvents` instances. */
  eventListeners,
});

export default heap;
