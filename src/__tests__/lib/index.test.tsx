import * as packageExports from '$main';

test.only('The package exposes an expected API', () => {
  expect(packageExports).toHaveProperty('useAppEvents');
  expect(packageExports).toHaveProperty('notifyEventListeners');
  expect(packageExports).toHaveProperty('listenForEvents');
  expect(packageExports).toHaveProperty('heap');
});
