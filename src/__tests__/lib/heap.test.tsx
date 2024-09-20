import { heap } from '$main';

describe('heap', () => {
  test('Heap has all properties', () => {
    expect(heap).toHaveProperty('eventListeners');
  });

  test('Heap initialized correctly', () => {
    expect(heap.eventListeners).toEqual([]);
  });
});
