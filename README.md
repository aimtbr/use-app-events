# use-app-events

![NPM Version](https://img.shields.io/npm/v/use-app-events?color=%2340bb12) ![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/use-app-events?color=%2340bb12) ![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/use-app-events)

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
<br/>

> _This is a truncated version of README to reduce the package size._
>
> ##### [[ _See full docs on GitHub_ ]](https://github.com/aimtbr/use-app-events?tab=readme-ov-file#use-app-events)

<br/>

## License

MIT

## Author

Maksym Marchuk

