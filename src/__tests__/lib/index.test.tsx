import * as packageExports from '$';

test.only('The package exposes the expected API', () => {
  expect(packageExports).toHaveProperty('useAppEvents');
  expect(packageExports).toHaveProperty('notifyEventListeners');
  expect(packageExports).toHaveProperty('listenForEvents');
  expect(packageExports).toHaveProperty('heap');
  expect(packageExports).toHaveProperty('options');
});
