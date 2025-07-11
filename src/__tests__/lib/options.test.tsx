import { options } from '$';

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
    // Clone the initial state of options
    const initialOptions = JSON.parse(
      JSON.stringify(options)
    ) as typeof options;

    // Update the initial values
    options.broadcast = !options.broadcast;
    options.debug = !options.debug;

    // Reset to the initial state
    options.reset();

    expect(options).toHaveProperty<boolean>(
      'broadcast',
      initialOptions.broadcast
    );
    expect(options).toHaveProperty<boolean>('debug', initialOptions.debug);
    expect(options).toHaveProperty('reset');
  });
});
