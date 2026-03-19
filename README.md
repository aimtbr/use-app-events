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

```js
// Global variable name - 'theme'
// Initial value - 'light'
const [theme, updateTheme] = useGlobal('theme', 'light');

// 1. Re-render with the new "dark" value
// 2. Save the theme value globally
updateTheme('dark');
```

---

#### Events

**Create your own custom events**

```js
// 1. Create a custom event by simply giving it a name
// For example, 'media-resume'
listenForEvents('media-resume', () => {
  // do something when the event is triggered
});

// 2. Now that you have your custom event created with listenForEvents
// Trigger the event by its name
notifyEventListeners('media-resume');
```

<br/>
<br/>

> _This is a truncated version of README to reduce the package size._
>
> ##### [[ _See full docs on GitHub_ ]](https://github.com/aimtbr/use-app-events?tab=readme-ov-file#use-app-events)

<br/>

## License

[MIT](https://github.com/aimtbr/use-app-events/blob/main/LICENSE)

## Author

Maksym Marchuk
