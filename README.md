# use-app-events

Global communication between components/hooks in React.

✉️ Send an event containing payload from one component/hook to another.  
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

## Examples

**Shared hook state**  
The example below demonstrates a potential implementation of a simple `useVolume` hook, which allows managing a volume from any component of the app.

**[[See full source code]](https://github.com/aimtbr/use-app-events/blob/main/examples/shared-hook-state)**

```tsx
enum EventType {
  VOLUME_CHANGE = 'volume-change',
}

const useVolume = () => {
  const [volume, setVolume] = useState<number>(100);

  const { notifyEventListeners, listenForEvents } = useAppEvents<EventType>();

  // 1. If any other instance of the useVolume hook has its volume state updated
  listenForEvents(EventType.VOLUME_CHANGE, (volumeNext: number) => {
    // 1.1. Synchronize the volume value of this instance, with a new one
    setVolume(volumeNext);
  });

  const updateVolume = (volumeNext: number) => {
    setVolume(volumeNext);

    // 2. Notify all other useVolume hook instances about the changed volume value
    notifyEventListeners(EventType.VOLUME_CHANGE, volumeNext);
  };

  return {
    volume,
    updateVolume,
  };
};
```

<br/>

**Communication between components**  
The example below demonstrates the potential use of useAppEvents to exchange messages (events) between unrelated components.  

Note: this is a simplified example, click the link below to see the full one if needed.

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

