type Options = {
  /** When false, `notifyEventListeners` will not broadcast events to other browsing contexts by default. */
  broadcast: boolean;

  /** When true, the debug mode will be enabled globally, resulting in additional logs. */
  debug: boolean;

  /** Reset options to their initial state. */
  reset: () => Options;
};

/** Create a new options object with initial values. */
const createOptions = (): Options =>
  Object.seal<Options>({
    broadcast: true,

    debug: false,

    // TODO: make the `reset` property non-configurable
    reset: () => Object.assign(options, createOptions()),
  });

const options = createOptions();

export default options;