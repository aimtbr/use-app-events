# use-app-events

![NPM Version](https://img.shields.io/npm/v/use-app-events?color=%2340bb12) ![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/use-app-events?color=%2340bb12) ![Code test coverage](https://img.shields.io/badge/coverage-100%25-40bb12?logo=100) ![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/use-app-events)

Event system for global communication in vanilla JavaScript and React.

📨 Emit events with some data  
📩 Listen for the emitted events (and process the sent data)

<br/>

> 📦 Small package (~<u>19 kB</u>)  
> 🍃 Tree-shakeable  
> 📝 Well documented  
> 🛡️ Strictly typed with TypeScript  
> ♻️ Events interact with each other across different browser tabs  
> ⚛️ Exports a convenient hook for <u>React</u> developers

<br/>

## Examples

```js
import { notifyEventListeners, listenForEvents } from 'use-app-events';

// 1. Listen for an event
listenForEvents('event-1', () => {
  // do something when the event is emitted
});

// 2. Emit an event
notifyEventListeners('event-1');

// 3. Listen for an event (it will only be processed once here)
listenForEvents.once('event-2', async (url) => {
  await fetch(url);
});

// 4. Emit an event with some data
notifyEventListeners('event-2', 'https://www.npmjs.com/package/use-app-events');

// 5. Listen for multiple events
listenForEvents(['event-1', 'event-2'], (eventType, url) => {
  if (eventType === 'event-1') {
    // do something when 'event-1' is emitted
  }

  if (eventType === 'event-2') {
    // do something when 'event-2' is emitted
  }
});

// 6. Emit multiple events with some data
notifyEventListeners(
  ['event-1', 'event-2'],
  'https://www.npmjs.com/package/use-app-events'
);
```

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
<br/>

> _This is a truncated version of README to reduce the package size._
>
> ##### [[_See full docs on GitHub_]](https://github.com/aimtbr/use-app-events?tab=readme-ov-file#use-app-events)

<br/>

## License

MIT

## Author

Maksym Marchuk
