# use-app-events

![NPM Version](https://img.shields.io/npm/v/use-app-events?color=%2340bb12) ![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/use-app-events?color=%2340bb12) ![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/use-app-events)

Event system for global communication in vanilla JavaScript and React.

📨 Send events and data from one part of the app to another.  
📩 Listen for events to occur in the app and process their payload.  
🌍 Organize and manage your global app state via events.

<br/>

## Facts

📦 Small package size  
🍃 Tree-shakable  
📝 Well documented  
🛡️ Strictly typed with TypeScript  
♻️ Works between different browser <u>tabs</u>  
🪝 Exports a convenient hook for <u>React</u> developers

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

- **notifyEventListeners**
  - Function to notify all listeners of the specified event type(s) subscribed via `listenForEvents`.
- **listenForEvents**
  - Function to subscribe and listen for the specified event type(s) to occur in the app.
- **listenForEvents.once**
  - Function to subscribe and listen for the specified event type(s) to occur in the app **once**.
- **useAppEvents**
  - Hook for managing application events in React.
- **heap**
  - _(readonly)_ Collection of resources operated by the package.
- **options**
  - Collection of options used to adjust the behavior of the package.

<br/>

## API

<br/>

**Hook for managing application events in React.**

```ts
useAppEvents<EventType extends string>(args): result
  - args?: {
      /** When true, enables a debug mode in non-production environment. */
      debug: boolean;
    }

  - result: {
      /** [Overload 1] Subscribe and listen for the specified event type to occur in the app. */
      function listenForEvents<Payload>(
        eventType: EventType,
        callback:
          | Callback<void>
          | Callback<Payload>
          | AsyncCallback<void>
          | AsyncCallback<Payload>
      ): CleanupFunction;

      /** [Overload 2] Subscribe and listen for the specified event types to occur in the app. */
      function listenForEvents<Payload>(
        eventTypes: EventType[],
        callback:
          | Callback<void>
          | Callback<Type>
          | Callback<[Type, Payload]>
          | AsyncCallback<void>
          | AsyncCallback<Type>
          | AsyncCallback<[Type, Payload]>
      ): CleanupFunction;

      /** [Overload 1] Notify all listeners of the specified event type subscribed via `listenForEvents`. */
      function notifyEventListeners<Payload>(
        /** Listeners of this event type will be notified. */
        eventType: EventType,
        /** Data to send to listeners of this event type. */
        payload?: Payload,
        /** When false, the event is not sent to other browsing contexts. */
        broadcast?: boolean = options.broadcast
      ): void;

      /** [Overload 2] Notify all listeners of the specified event types subscribed via `listenForEvents`. */
      function notifyEventListeners<Payload>(
        /** Listeners of these event types will be notified. */
        eventTypes: EventType[],
        /** Data to send to listeners of these event types. */
        payload?: Payload,
        /** When false, the event is not sent to other browsing contexts. */
        broadcast?: boolean = options.broadcast
      ): void;
    }
```

> The `notifyEventListeners` and `listenForEvents` functions are also available independently outside of the `useAppEvents` hook to be used beyond the React components/hooks.
>
> However, prefer `useAppEvents` in React when possible.

<br/>

**Collection of resources operated by the package.**

```tsx
heap: {
  /** The array of listeners used by the active `listenForEvents` instances. */
  eventListeners: Listener[];
}
```

<br/>

**Collection of options used to adjust the behavior of the package.**

```tsx
options: {
  /** When false, `notifyEventListeners` will not broadcast events to other browsing contexts by default. */
  broadcast: boolean = true;

  /** When true, the debug mode will be enabled globally, resulting in additional logs. */
  debug: boolean = false;
}
```

<br/>

## How to use

1. **Adjust options**

   ```tsx
   import options from 'use-app-events/options';
   import notifyEventListeners from 'use-app-events/notifyEventListeners';
   ```

   a. Disable event broadcasting entirely

   ```tsx
   options.broadcast = false;

   // From now on, notifyEventListeners will send events to listeners of the current tab only by default
   notifyEventListeners('event-A', 'some-payload');
   ```

2. **Listen for events in the React component**

   ```ts
   import { useAppEvents } from 'use-app-events';
   ```

   a. Single event

   ```tsx
   const Component = () => {
     const { listenForEvents } = useAppEvents();

     listenForEvents('event-A', (payload) => {
       // 1. Do something when 'event-A' occurs...
       // 2. Process a payload if you expect it to be sent by `notifyEventListeners`
     });
   };
   ```

   b. Multiple events

   ```tsx
   const Component = () => {
     const { listenForEvents } = useAppEvents();

     listenForEvents(['event-A', 'event-B'], (eventType, payload) => {
       // 1. Do something when either 'event-A' or 'event-B' occurs...

       // 2. Select a specific event by its type from `eventType`
       if (eventType === 'event-A') {
         console.log('We got an event A with some data', payload);
       }
     });
   };
   ```

3. **Notify the event listeners from the React component**

   ```tsx
   import { useAppEvents } from 'use-app-events';
   ```

   a. Without a payload (only event)

   ```tsx
   const Component = () => {
     const { notifyEventListeners } = useAppEvents();

     // Notify the listeners of this event type with no data
     notifyEventListeners('event-A');
   };
   ```

   b. With a payload (event + data)

   ```tsx
   const Component = () => {
     const { notifyEventListeners } = useAppEvents();

     const payload = { a: 1, b: 2 };

     // Notify the listeners of this event type and give them some data
     notifyEventListeners('event-A', payload);
   };
   ```

   c. Disable event broadcasting for a specific call

   ```tsx
   const Component = () => {
     const { notifyEventListeners } = useAppEvents();

     const payload = { a: 1, b: 2 };

     // Notify the listeners of this event type in the current tab only
     notifyEventListeners('event-A', payload, false);
   };
   ```

<br/>

## TypeScript

- It is recommended to have a list of event types that can be used in your app, for example, enum called `EventType`, and pass it to `useAppEvents()` for type safety and misprint-proof:
  ![EventType passed to useAppEvents as a type](https://raw.githubusercontent.com/aimtbr/use-app-events/main/.github/image-1.png)

  <br/>

  <ins>This way you are protected from the unexpected event types...</ins>

  <br/>

  ![Unacceptable type passed as the event type to listenForEvents](https://raw.githubusercontent.com/aimtbr/use-app-events/main/.github/image-2.png)

  <br/>

  <ins>...and only allowed to use the expected ones.</ins>

  <br/>

  ![The expected allowed event type passed to listenForEvents](https://raw.githubusercontent.com/aimtbr/use-app-events/main/.github/image-3.png)
  ![The expected allowed event type passed to notifyEventListeners](https://raw.githubusercontent.com/aimtbr/use-app-events/main/.github/image-4.png)

  <br/>

- However, if `EventType` is not provided, any `string` or `enum` can be used:
  ![Plain string passed as the event type to listenForEvents and notifyEventListeners](https://raw.githubusercontent.com/aimtbr/use-app-events/main/.github/image-5.png)

<br/>

## Use cases

- **[Don't use React.createContext(), create hooks.](https://dev.to/maqs/dont-use-reactcontext-create-hooks-40a9)**
- **[Send data between tabs in React.](https://dev.to/maqs/send-data-between-tabs-in-react-obk)**

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

The motivation to create `use-app-events` was to find a way to manage the state from any part of the app (globally) and allow all elements to communicate with each other regardless of their position in the tree.

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
