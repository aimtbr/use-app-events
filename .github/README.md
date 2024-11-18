# use-app-events

![NPM Version](https://img.shields.io/npm/v/use-app-events?color=%2340bb12) ![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/use-app-events?color=%2340bb12) ![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/use-app-events)

Event system for global communication in vanilla JavaScript and React.

📨 Send events and data from one part of the app to another.  
📩 Listen for events to occur in the app and process their payload.  
🌍 Organize and manage your global app state via events.

<br/>

## Facts

📦 Small package size  
🍃 Tree-shakeable  
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

   a. Disable event broadcasting globally

   ```tsx
   options.broadcast = false;

   // From now on, notifyEventListeners will send events to listeners of the current tab only by default
   notifyEventListeners('event-A', 'some-payload');
   ```

   b. Enable the debug mode globally

   ```tsx
   options.debug = true;

   // From now on, listenForEvents and notifyEventListeners will output additional console logs on different stages
   listenForEvents('event-A', () => {});
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

   a. Send an event

   ```tsx
   const Component = () => {
     const { notifyEventListeners } = useAppEvents();

     // Notify the listeners of this event type with no data
     notifyEventListeners('event-A');
   };
   ```

   b. Send an event with a payload

   ```tsx
   const Component = () => {
     const { notifyEventListeners } = useAppEvents();

     const payload = { a: 1, b: 2 };

     // Notify the listeners of this event type and give them some data
     notifyEventListeners('event-A', payload);
   };
   ```

   c. Send multiple events with a payload at once

   ```tsx
   const Component = () => {
     const { notifyEventListeners } = useAppEvents();

     const payload = { a: 1, b: 2 };

     // Notify the listeners of these event types and give them some data
     notifyEventListeners(['event-A', 'event-B'], payload);
   };
   ```

   d. Send multiple events with a payload, but don't broadcast

   ```tsx
   const Component = () => {
     const { notifyEventListeners } = useAppEvents();

     const payload = { a: 1, b: 2 };

     // Notify the listeners of this event type in the current tab only
     notifyEventListeners('event-A', payload, false);
     // Notify the listeners of these event types in the current tab only
     notifyEventListeners(['event-B', 'event-C'], payload, false);
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
