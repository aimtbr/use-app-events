# use-app-events

Global communication between components, hooks and tabs in React.

🌍 Organize and manage your global app state via hooks and events.  
✉️ Send events with a payload from one component, hook or **tab** to another.  
📩 Listen for events of a specific type to occur and process the received payload.

<br/>

## Install

**npm**

```bash
npm install use-app-events
```

**pnpm**

```bash
pnpm add use-app-events
```

<br/>

## Exports

- **useAppEvents**
  - Hook for managing application events.
- **notifyEventListeners**
  - Function to notify all listeners of the specified event type subscribed via `listenForEvents`.
- **listenForEvents**
  - Function to subscribe and listen for the specified event type(s) to occur in the app.
- **heap**
  - Object containing `eventListeners`, an array of event listeners created by `use-app-events` (look, don't touch).

<br/>

## API

```ts
/** Hook for managing application events. */
useAppEvents<Type extends string>(args): result
  - args?: {
      /** When true, enables a debug mode in non-production environment. */
      debug: boolean;
    }

  - result: {
      /** Notify all listeners of the specified event type subscribed via `listenForEvents`. */
      function notifyEventListeners<Payload>(
        eventType: Type,
        payload: Payload,
        /** When false, the event is not sent to other browsing contexts. */
        broadcast: boolean = true
      ): void;

      /** [Overload 1] Subscribe and listen for the specified event type to occur in the app. */
      function listenForEvents<Payload>(
        eventType: Type, // single event type
        callback: Callback<void> | Callback<Payload>
      ): CleanupFunction;

      /** [Overload 2] Subscribe and listen for the specified event types to occur in the app. */
      function listenForEvents<Payload>(
        eventGroup: Type[], // multiple event types
        callback: Callback<Type> | Callback<[Type, Payload]>
      ): CleanupFunction;
    }
```

> The `notifyEventListeners` and `listenForEvents` functions are also available independently outside of the `useAppEvents` hook to be used beyond the React components/hooks.
>
> However, prefer `useAppEvents` when possible.

<br/>

## TypeScript

- It is recommended to have a list of event types that can be used in your app, for example, enum called `EventType`, and pass it to `useAppEvents()` for type safety and misprint-proof:
  ![EventType passed to useAppEvents as a type](https://raw.githubusercontent.com/aimtbr/use-app-events/main/docs/image-1.png)

  <br/>

  <ins>This way you are protected from the unexpected event types...</ins>

  <br/>

  ![Unacceptable type passed as the event type to listenForEvents](https://raw.githubusercontent.com/aimtbr/use-app-events/main/docs/image-2.png)

  <br/>

  <ins>...and only allowed to use the expected ones.</ins>

  <br/>

  ![The expected allowed event type passed to listenForEvents](https://raw.githubusercontent.com/aimtbr/use-app-events/main/docs/image-3.png)
  ![The expected allowed event type passed to notifyEventListeners](https://raw.githubusercontent.com/aimtbr/use-app-events/main/docs/image-4.png)

  <br/>

- However, if `EventType` is not provided, any `string` or `enum` can be used:
  ![Plain string passed as the event type to listenForEvents and notifyEventListeners](https://raw.githubusercontent.com/aimtbr/use-app-events/main/docs/image-5.png)

<br/>

## Use cases

- **[Don't use React.createContext(), create hooks.](https://dev.to/maqs/dont-use-reactcontext-create-hooks-40a9)**

<br/>

## Examples

**[[See all examples]](https://github.com/aimtbr/use-app-events/blob/main/examples)**

**1. Global theme state**  
The example below demonstrates a potential implementation of the `useTheme` hook, which allows getting and updating a theme from any component of the app.

```tsx
enum EventType {
  THEME_UPDATE = 'theme-update',
}

const useTheme = () => {
  const [theme, setTheme] = useState('dark');

  const { notifyEventListeners, listenForEvents } = useAppEvents<EventType>();

  // 1. If any other instance of the useTheme hook has its theme value updated
  listenForEvents(EventType.THEME_UPDATE, (themeNext: string) => {
    // 1.1. Synchronize the theme value of this instance, with a new one
    setTheme(themeNext);
  });

  const updateTheme = (themeNext: string) => {
    setTheme(themeNext);

    // 2. Notify all other useTheme hook instances about the changed value
    notifyEventListeners(EventType.THEME_UPDATE, themeNext);
  };

  return {
    theme,
    updateTheme,
  };
};

// Then use the useTheme hook anywhere in the app to get and update its value globally
const App = () => {
  const { theme, updateTheme } = useTheme();

  updateTheme('light');

  // Output: <div>Current theme: light</div>
  return <div>Current theme: {theme}</div>;
};
```

---

<br/>

**2. Communication between components**  
The example below demonstrates the potential use of `useAppEvents` to exchange messages (events) between unrelated components.

_Note: this is a simplified example, click the link below to see the full one if needed._

**[[See full source code]](https://github.com/aimtbr/use-app-events/blob/main/examples/global-communication)**

```tsx
enum EventType {
  KEVIN_FOLLOWERS = 'kevin-followers',
  JOHN_RELATIVES = 'john-relatives',
}

const GlobalCommunication = () => {
  return (
    <>
      <h2>Global Communication</h2>

      <SisterComponent />
      <BrotherComponent />
    </>
  );
};

function SisterComponent() {
  const { listenForEvents } = useAppEvents<EventType>();

  // Listen for events of type KEVIN_FOLLOWERS
  listenForEvents(EventType.KEVIN_FOLLOWERS, (messageNext: string) => {
    // process a message from Kevin...
  });

  // Listen for events of type JOHN_RELATIVES
  listenForEvents(EventType.JOHN_RELATIVES, (messageNext: string) => {
    // process a message from John
  });

  return null;
}

function BrotherComponent() {
  const { notifyEventListeners } = useAppEvents<EventType>();

  // Send an event to the listeners of event JOHN_RELATIVES (Sister is listening)
  notifyEventListeners(
    EventType.JOHN_RELATIVES,
    "Hello everyone, let's meet tomorrow!"
  );

  return <BrotherChildComponent />;
}

function BrotherChildComponent() {
  const { notifyEventListeners } = useAppEvents<EventType>();

  // Send an event to the listeners of event KEVIN_FOLLOWERS (Sister is listening)
  notifyEventListeners(EventType.KEVIN_FOLLOWERS, "Hey, it's Kevin!");

  return null;
}
```

<br/>

## Motivation

Usually, it was recommended to use `React context` to manage the global state of the app without "prop drilling".

However, as the app grows, the number of `contexts` increases accordingly and partially ruins the readability and usability of your app.

<ins>So, the motivation</ins> to create `use-app-events` was to find a way to share and manage the state from any part of the app (globally) and allow all components to communicate with each other regardless of their position in the tree.

<br/>

## Try it yourself

Clone the [repository](https://github.com/aimtbr/use-app-events), install dependencies, and run the `dev` script to start a web app and play around with examples.

**pnpm**

```bash
git clone https://github.com/aimtbr/use-app-events.git && cd use-app-events && pnpm install && pnpm dev
```

**npm**

```bash
git clone https://github.com/aimtbr/use-app-events.git && cd use-app-events && npm install && npm run dev
```

<br/>

## License

MIT

## Author

Maksym Marchuk

