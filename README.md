# use-app-events

![NPM Version](https://img.shields.io/npm/v/use-app-events?color=%2340bb12) ![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/use-app-events?color=%2340bb12) ![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/use-app-events)

Event system for global communication in JavaScript.

🌍 Organize and manage your global app state via events.  
📨 Send events and data from one part of the app to another.  
📩 Listen for events to occur and process their payload.

<br/>

## Facts

📦 Small bundle size  
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
<br/>

> _This is a truncated version of README to reduce the package size._
>
> ##### [[_See full docs on GitHub_]](https://github.com/aimtbr/use-app-events?tab=readme-ov-file#use-app-events)

<br/>

## License

MIT

## Author

Maksym Marchuk
