/* eslint-disable @typescript-eslint/no-explicit-any */
import { Listener } from '$types';

type Heap = {
  /** The array of listeners used by active `listenForEvents` instances. */
  eventListeners: Listener<any, any>[];

  /** Reset the heap to its initial state. */
  reset: () => Heap;
};

/** Create a new heap object with initial values. */
const createHeap = (): Heap =>
  Object.seal<Heap>({
    eventListeners: [],

    // TODO: make the `reset` property non-configurable
    reset: () => Object.assign(heap, createHeap()),
  });

const heap = createHeap();

export default heap;
