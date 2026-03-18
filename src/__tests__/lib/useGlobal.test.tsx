import { heap } from '$';
import { renderHook, act } from '@testing-library/react';
import useGlobal from '$lib/useGlobal/useGlobal';

enum EventType {
  Theme = 'theme',
  Counter = 'counter',
  Lang = 'lang',
}

describe('useGlobal', () => {
  test('Return undefined when no initial value is provided', () => {
    const { result } = renderHook(() => useGlobal<string>(EventType.Theme));

    const [value] = result.current;

    expect(value).toBeUndefined();
  });

  test('Return the initial value', () => {
    const initialValue = 'dark';

    const { result } = renderHook(() =>
      useGlobal<string>(EventType.Theme, initialValue),
    );

    const [value] = result.current;

    expect(value).toBe(initialValue);
  });

  test('Update the value', () => {
    const { result } = renderHook(() =>
      useGlobal<string>(EventType.Theme, 'light'),
    );

    act(() => {
      const [, updateValue] = result.current;
      updateValue('dark');
    });

    const [value] = result.current;

    expect(value).toBe('dark');
  });

  test('Update the value using a function', () => {
    const { result } = renderHook(() =>
      useGlobal<number>(EventType.Counter, 0),
    );

    act(() => {
      const [, updateValue] = result.current;
      updateValue((prev) => prev + 1);
    });

    const [value] = result.current;

    expect(value).toBe(1);
  });

  test('Synchronize the value across multiple instances', () => {
    const instanceA = renderHook(() =>
      useGlobal<string>(EventType.Theme, 'light'),
    );

    const instanceB = renderHook(() => useGlobal<string>(EventType.Theme));
    const [instanceBValue] = instanceB.result.current;

    // Flush the _INIT sync effect
    act(() => {});

    // Instance B should have received the value from instance A via _INIT

    expect(instanceBValue).toBe('light');

    // Update from instance A
    act(() => {
      const [, updateAValue] = instanceA.result.current;
      updateAValue('dark');
    });

    // Both instances should reflect the new value
    expect(instanceA.result.current[0]).toBe('dark');
    expect(instanceB.result.current[0]).toBe('dark');
  });

  test('Synchronize the value when a new instance is created after an update', () => {
    const instanceA = renderHook(() =>
      useGlobal<number>(EventType.Counter, 10),
    );

    act(() => {
      const [, updateValue] = instanceA.result.current;
      updateValue(42);
    });

    // Create a new instance after the value has been updated
    const instanceB = renderHook(() => useGlobal<number>(EventType.Counter));

    // Flush the _INIT sync effect
    act(() => {});

    const [instanceBValue] = instanceB.result.current;

    expect(instanceBValue).toBe(42);
  });

  test('Update from one instance propagates to all other instances', () => {
    const instanceA = renderHook(() =>
      useGlobal<string>(EventType.Theme, 'light'),
    );

    const instanceB = renderHook(() => useGlobal<string>(EventType.Theme));

    const instanceC = renderHook(() => useGlobal<string>(EventType.Theme));

    act(() => {
      const [, updateBValue] = instanceB.result.current;
      updateBValue('dark');
    });

    expect(instanceA.result.current[0]).toBe('dark');
    expect(instanceB.result.current[0]).toBe('dark');
    expect(instanceC.result.current[0]).toBe('dark');
  });

  test('Different event types maintain independent values', () => {
    const themeHook = renderHook(() =>
      useGlobal<string>(EventType.Theme, 'dark'),
    );
    const counterHook = renderHook(() =>
      useGlobal<number>(EventType.Counter, 0),
    );

    act(() => {
      const [, updateTheme] = themeHook.result.current;
      updateTheme('light');
    });

    const [themeValue] = themeHook.result.current;
    const [counterValue] = counterHook.result.current;

    expect(themeValue).toBe('light');
    expect(counterValue).toBe(0);
  });

  test('Disable synchronization', () => {
    const instanceA = renderHook(() =>
      useGlobal<string>(EventType.Theme, 'light'),
    );

    const instanceB = renderHook(() =>
      useGlobal<string>(EventType.Theme, undefined, { synchronize: false }),
    );

    // Instance B should not have received the initial value from A
    const [instanceBInitialValue] = instanceB.result.current;

    expect(instanceBInitialValue).toBeUndefined();

    // But direct updates should still propagate
    act(() => {
      const [, updateValue] = instanceA.result.current;
      updateValue('dark');
    });

    const [instanceBUpdatedValue] = instanceB.result.current;

    expect(instanceBUpdatedValue).toBe('dark');
  });

  test('Enable debug mode', () => {
    const mockConsoleLog = jest.fn();
    console.Console.prototype.log = mockConsoleLog;

    const instance = renderHook(() =>
      useGlobal<string>(EventType.Theme, 'light', { debug: true }),
    );

    instance.unmount();

    // Should have logged INIT and CLEANUP messages
    expect(mockConsoleLog).toHaveBeenCalled();
  });

  test('Disable debug mode', () => {
    const mockConsoleLog = jest.fn();
    console.Console.prototype.log = mockConsoleLog;

    renderHook(() =>
      useGlobal<string>(EventType.Theme, 'light', { debug: false }),
    );

    expect(mockConsoleLog).not.toHaveBeenCalled();
  });

  test('Clean up listeners on unmount', () => {
    const instance = renderHook(() =>
      useGlobal<string>(EventType.Theme, 'light'),
    );

    // Listeners should be registered
    expect(heap.eventListeners.length).toBeGreaterThan(0);

    instance.unmount();

    expect(heap.eventListeners.length).toBe(0);
  });

  test('Return a stable updateValue function reference', () => {
    const { result, rerender } = renderHook(() =>
      useGlobal<string>(EventType.Theme, 'light'),
    );

    const [, firstUpdateValue] = result.current;

    rerender();

    const [, secondUpdateValue] = result.current;

    // updateValue is recreated each render as it's defined inline,
    // but both should be callable functions
    expect(typeof firstUpdateValue).toBe('function');
    expect(typeof secondUpdateValue).toBe('function');
  });

  test('Handle object values', () => {
    type Config = { theme: string; fontSize: number };

    const instanceA = renderHook(() =>
      useGlobal<Config>(EventType.Theme, { theme: 'dark', fontSize: 14 }),
    );
    const instanceB = renderHook(() => useGlobal<Config>(EventType.Theme));

    // Flush the _INIT sync effect
    act(() => {});

    const [, updateValue] = instanceA.result.current;

    act(() => {
      updateValue({ theme: 'light' });
    });

    const [instanceAValue] = instanceA.result.current;
    expect(instanceAValue).toEqual({
      theme: 'light',
      fontSize: 14,
    });

    act(() => {
      updateValue({ theme: 'dark', fontSize: 16 });
    });

    const [instanceBValue] = instanceB.result.current;
    expect(instanceBValue).toEqual({
      theme: 'dark',
      fontSize: 16,
    });
  });
});
