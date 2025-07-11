import { heap } from '$';

describe('heap', () => {
  test('Heap has all properties', () => {
    expect(heap).toHaveProperty('eventListeners');
    expect(heap).toHaveProperty('reset');
  });

  test('Heap initialized properly', () => {
    expect(heap.eventListeners).toEqual([]);
    expect(heap.reset).toBeInstanceOf(Function);
  });

  test('Heap reset properly', () => {
    // Clone the initial state of the heap
    const initialHeap = JSON.parse(JSON.stringify(heap)) as typeof heap;

    // Update the initial value
    heap.eventListeners = [{ eventType: 'anything', callback: () => {} }];

    // Reset to the initial state
    heap.reset();

    expect(heap).toHaveProperty('eventListeners', initialHeap.eventListeners);
    expect(heap).toHaveProperty('reset');
  });
});
