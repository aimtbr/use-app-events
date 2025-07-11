import { heap, options } from '$';

afterEach(() => {
  jest.restoreAllMocks();

  heap.reset();
  options.reset();
});
