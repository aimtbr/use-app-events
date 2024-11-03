import { heap, options } from '$main';

afterEach(() => {
  jest.restoreAllMocks();

  heap.reset();
  options.reset();
});
