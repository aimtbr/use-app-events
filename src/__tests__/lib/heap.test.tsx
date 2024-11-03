import { heap } from '$main';

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
    const initialOptions = heap;

    heap.eventListeners = [];

    const resetOptions = heap.reset();

    expect(resetOptions).toHaveProperty(
      'eventListeners',
      initialOptions.eventListeners
    );
    expect(resetOptions).toHaveProperty('reset');
  });
});
