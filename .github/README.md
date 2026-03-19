# use-app-events

![NPM Version](https://img.shields.io/npm/v/use-app-events?color=%2340bb12) ![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/use-app-events?color=%2340bb12) ![Code test coverage](https://img.shields.io/badge/coverage-100%25-40bb12?logo=100) ![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/use-app-events)

- Create, trigger and listen for custom events in vanilla JavaScript and React.
- Create the reactive global variables in React instead of a complex state and cumbersome context.

<br/>

> 📦 Small package (~<u>19 kB</u>)  
> 🍃 Tree-shakeable  
> 📝 Well documented  
> 🛡️ Strictly typed with TypeScript  
> ♻️ Events interact with each other across different browser tabs  
> ⚛️ Exports a convenient API for React developers

<br/>

## Table of contents

- [Installation](#installation)
- [API](#api)
- [Examples](#examples)
- [How to use](#how-to-use)
- [TypeScript](#typescript)
- [Use cases](#use-cases)
- [Try it yourself](#try-it-yourself)
- [Motivation](#motivation)
- [License](#license)
- [Author](#author)

<br/>

## Installation

**npm**

```bash
npm install use-app-events
```

**pnpm**

```bash
pnpm add use-app-events
```

<br/>

## API

- **useGlobal** 🆕
  - Create a reactive global variable in React.
  - _For example, as a replacement for React context (`createContext`)_
- **useAppEvents**
  - Hook for managing application events in React.
- **notifyEventListeners**
  - Function to notify all listeners of the specified event type(s) subscribed via `listenForEvents`.
- **listenForEvents**
  - Function to subscribe and listen for the specified event type(s) to occur in the app.
- **listenForEvents.once**
  - Function to subscribe and listen for the specified event type(s) to occur in the app only <u>once</u>.
- **heap**
  - _(readonly)_ Collection of resources operated by the package.
- **options**
  - Collection of options used to adjust the behavior of the package.

<br/>

## Examples

#### Imports

**Normal**

```js
import { useGlobal } from 'use-app-events';
```

**Selective (tree-shakeable)**

```js
import notifyEventListeners from 'use-app-events/notifyEventListeners';
```

---

#### State 🆕

**Create a reactive global variable in React 🆕**

1. The initial value of the variable is retrieved from the older instances of useGlobal if any (_can be turned off by disabling the `synchronize` option_, see below), otherwise your initial value is used.
   ```js
   // Turning off the `synchronize` option
   const [value, updateValue] = useGlobal('value', undefined, { synchronize: false })
   ```
2. The value is broadcasted to other browser tabs every time it's updated, meaning the value is the same in all tabs of your app serving as sessionStorage in some way for as long as there are multiple tabs open.

**1. Storing a primitive**

```js
// Global variable name - 'theme'
// Initial value - 'light'
const [theme, updateTheme] = useGlobal('theme', 'light');

// 1. Re-render with the new "dark" value
// 2. Save the theme value globally
updateTheme('dark');
```

**2. Storing an object**

```js
const [params, updateParams] = useGlobal('params', {
  color: 'white',
  palette: 'dark',
});

// Color will be updated in the original object
updateParams({ color: 'black' });

// Or get a previous value (just like setState in useState)
updateParams((prevValue) => ({
  ...prevValue,
  color: prevValue.palette === 'dark' ? 'black' : 'white',
}));
```

---

#### Events

**Create your own custom events**

**1. Listen for an event**

```js
listenForEvents('media-resume', () => {
  // do something when the event is triggered
});
```

**2. Emit an event**

```js
notifyEventListeners('media-resume');
```

**3. Listen for an event (it will only be processed once here)**

```js
listenForEvents.once('load-resource', async (url) => {
  await fetch(url);
});
```

**4. Emit an event with some data**

```js
notifyEventListeners(
  'load-resource',
  'https://www.npmjs.com/package/use-app-events',
);
```

**5. Listen for multiple events**

```js
const unlisten = listenForEvents(['event-1', 'event-2'], (eventType, url) => {
  if (eventType === 'event-1') {
    // do something when 'event-1' is emitted
  }

  if (eventType === 'event-2') {
    // do something when 'event-2' is emitted
  }
});
```

**6. Stop listening for events**

```js
unlisten();
```

**7. Emit multiple events with some data**

```js
notifyEventListeners(
  ['event-1', 'event-2'],
  'https://www.npmjs.com/package/use-app-events',
);
```

**[[ More examples ]](https://github.com/aimtbr/use-app-events/blob/main/examples)**

<br/>

## How to use

1. **Create a reactive global variable in React 🆕**
  a. Create a hook for global theme management

   ```js
   import { useGlobal } from 'use-app-events';

   export const useTheme = () => {
     const [theme, updateTheme] = useGlobal('theme', 'light');

     return {
       theme,
       updateTheme,
     };
   };

   // Use the hook in your component to get or update the theme globally
   const { theme, updateTheme } = useTheme();

   updateTheme('dark');
   ```

1. **Listen for events in React**

   ```ts
   import { useAppEvents } from 'use-app-events';
   ```

   a. Listen for an event

   ```tsx
   const Component = () => {
     const { listenForEvents } = useAppEvents();

     listenForEvents('event-A', (payload) => {
       // 1. Do something when 'event-A' is triggered...
       // 2. Process a payload if you expect it to be sent by `notifyEventListeners`
     });
   };
   ```

   b. Listen for multiple events

   ```tsx
   const Component = () => {
     const { listenForEvents } = useAppEvents();

     listenForEvents(['event-A', 'event-B'], (eventType, payload) => {
       // 1. Do something when either 'event-A' or 'event-B' is triggered...

       // 2. Process a specific event by its type in `eventType`
       if (eventType === 'event-A') {
         console.log('We got an event A with some data', payload);
       }
     });
   };
   ```

1. **Notify the event listeners in React**

   a. Trigger an event

   ```tsx
   const Component = () => {
     const { notifyEventListeners } = useAppEvents();

     // Notify the listeners of this event type with no data
     notifyEventListeners('event-A');
   };
   ```

   b. Trigger an event with some data

   ```tsx
   const Component = () => {
     const { notifyEventListeners } = useAppEvents();

     const payload = { a: 1, b: 2 };

     // Notify the listeners of this event type and give them some data
     notifyEventListeners('event-A', payload);
   };
   ```

   c. Trigger multiple events with some data at once

   ```tsx
   const Component = () => {
     const { notifyEventListeners } = useAppEvents();

     const payload = { a: 1, b: 2 };

     // Notify the listeners of these event types and give them some data
     notifyEventListeners(['event-A', 'event-B'], payload);
   };
   ```

   d. Trigger multiple events with some data, but don't broadcast

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

1. **Adjust options**

   ```tsx
   import options from 'use-app-events/options';
   import notifyEventListeners from 'use-app-events/notifyEventListeners';
   ```

   a. Disable event broadcasting globally

   ```tsx
   options.broadcast = false;

   // From now on, notifyEventListeners will send events to the listeners of the current tab only by default
   notifyEventListeners('event-A', 'some-payload');
   ```

   b. Enable the debug mode globally

   ```tsx
   options.debug = true;

   // From now on, listenForEvents and notifyEventListeners will output additional console logs on different stages
   listenForEvents('event-A', () => {});
   notifyEventListeners('event-A', 'some-payload');
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

<!-- <br/>

## API

**Hook for managing application events in React.**

```ts
useAppEvents<EventType extends string>(args): result
  - args?: {
      /** When true, enables a debug mode, resulting in additional logs in non-production environment. */
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
        /** When false, the event is not sent to other browsing contexts (tabs, windows). */
        broadcast?: boolean = options.broadcast
      ): void;

      /** [Overload 2] Notify all listeners of the specified event types subscribed via `listenForEvents`. */
      function notifyEventListeners<Payload>(
        /** Listeners of these event types will be notified. */
        eventTypes: EventType[],
        /** Data to send to listeners of these event types. */
        payload?: Payload,
        /** When false, the event is not sent to other browsing contexts (tabs, windows). */
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
  /** When false, `notifyEventListeners` will not broadcast events to other browsing contexts (tabs, windows) by default. */
  broadcast: boolean = true;

  /** When true, enables a debug mode, resulting in additional logs in non-production environment. */
  debug: boolean = false;
}
``` -->

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

## Motivation

The motivation to create `use-app-events` was to find a way to manage the state from any part of the app (globally) and allow all elements to communicate with each other regardless of their position in the tree.

## License

[MIT](https://github.com/aimtbr/use-app-events/blob/main/LICENSE)

## Author

Maksym Marchuk
