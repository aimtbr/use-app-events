export type UseGlobalHook = {
  // Overload: with initial value
  <Value, EventType extends string = string>(
    eventType: EventType,
    initialValue: Value,
    options?: UseGlobalOptions,
  ): [Value, UpdateValueAction<Value, true>];

  // Overload: no initial value
  <Value, EventType extends string = string>(
    eventType: EventType,
    initialValue?: undefined,
    options?: UseGlobalOptions,
  ): [Value | undefined, UpdateValueAction<Value, false>];
};

export type UpdateValueAction<
  Value,
  HasInitialValue extends boolean = boolean,
> = {
  // Overload: plain value
  (nextValue: Value): void;

  // Overload: object value
  (nextValue: Partial<Value>): void;

  // Overload: function with a previous value
  (
    nextValue: (
      prevValue: HasInitialValue extends true ? Value : Value | undefined,
    ) => Value,
  ): void;
};

export type UseGlobalOptions = {
  /** When true, the debug mode will be enabled, resulting in additional logs. */
  debug?: boolean;
  /**
   * When true, the initial value will be set to the latest value retrieved from the older instances of this hook.
   *
   * **_Note: the initial synchronization doesn't work if the initial value is provided, because the hook will prioritize it over the value from the older instances._**
   * @default true
   */
  synchronize?: boolean;
};
