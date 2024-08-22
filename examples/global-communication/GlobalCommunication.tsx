import { useAppEvents } from '$lib';
import { useRef, useState } from 'react';
import { EventType } from '../constants';

/**
 * The example below demonstrates the potential use of useAppEvents
 * to exchange messages (events) between unrelated components.
 */
export const GlobalCommunication = () => {
  return (
    <div
      style={{
        border: '1px solid lightgray',
        padding: '3rem',
      }}
    >
      <h2>Global Communication</h2>
      <hr />

      <SisterComponent />
      <BrotherComponent />
    </div>
  );
};

function SisterComponent() {
  const [messages, setMessages] = useState<string[]>([]);

  const { listenForEvents } = useAppEvents<EventType>();

  const addMessage = (message: string) =>
    setMessages((messagesPrev) => [...messagesPrev, message]);

  // Listen for events of type KEVIN_FOLLOWERS
  listenForEvents(EventType.KEVIN_FOLLOWERS, (messageNext: string) => {
    addMessage(`Nephew Kevin says: ${messageNext}`);
  });

  // Listen for events of type JOHN_RELATIVES
  listenForEvents(EventType.JOHN_RELATIVES, (messageNext: string) => {
    addMessage(`Brother John says: ${messageNext}`);
  });

  return (
    <>
      <h3>Sister`s messages</h3>

      <ul
        style={{
          border: '1px solid lightgray',
          padding: '3rem',
          maxHeight: '5rem',
          overflow: 'auto',
        }}
      >
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </>
  );
}

function BrotherComponent() {
  const { notifyEventListeners } = useAppEvents<EventType>();

  // Send an event to the listeners of event JOHN_RELATIVES
  const notifyRelatives = () => {
    notifyEventListeners(
      EventType.JOHN_RELATIVES,
      "Hello everyone, let's meet tomorrow!"
    );
  };

  return (
    <div>
      <button onClick={notifyRelatives} style={{ float: 'right' }}>
        Notify relatives as John
      </button>

      <BrotherChildComponent />
    </div>
  );
}

function BrotherChildComponent() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { notifyEventListeners } = useAppEvents<EventType>();

  // Send an event to the listeners of event KEVIN_FOLLOWERS
  const notifyFollowers = () => {
    if (inputRef.current?.value) {
      notifyEventListeners(EventType.KEVIN_FOLLOWERS, inputRef.current.value);
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        placeholder="Message followers..."
        minLength={1}
        maxLength={100}
      />

      <button onClick={notifyFollowers}>Notify followers as Kevin</button>
    </div>
  );
}
