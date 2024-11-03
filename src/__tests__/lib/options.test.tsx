import { options } from '$main';

describe('options', () => {
  test('Options have all properties', () => {
    expect(options).toHaveProperty('broadcast');
    expect(options).toHaveProperty('debug');
    expect(options).toHaveProperty('reset');
  });

  test('Options initialized properly', () => {
    expect(options.broadcast).toEqual(true);
    expect(options.debug).toEqual(false);
    expect(options.reset).toBeInstanceOf(Function);
  });

  test('Options reset correctly', () => {
    const initialOptions = options;

    options.broadcast = !options.broadcast;
    options.debug = !options.debug;

    const resetOptions = options.reset();

    expect(resetOptions).toHaveProperty<boolean>(
      'broadcast',
      initialOptions.broadcast
    );
    expect(resetOptions).toHaveProperty<boolean>('debug', initialOptions.debug);
    expect(resetOptions).toHaveProperty('reset');
  });
});
