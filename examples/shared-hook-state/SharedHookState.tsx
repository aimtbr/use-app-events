import { EventType } from '../constants';
import { useAppEvents } from '$lib';
import { useState } from 'react';

/**
 * The example below demonstrates the potential implementation of the useVolume hook,
 * which allows managing a volume from any component of the app.
 */
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

/**
 * The usage example of the useVolume hook.
 *
 * When either Sister or Brother component have their volume state changed,
 * they immediately notify the sibling to update their volume too.
 */
export const SharedHookStateParent = () => {
  return (
    <div style={{ border: '1px solid lightgray', padding: '3rem' }}>
      <h2>Shared Hook State</h2>
      <hr />

      <SharedHookStateSister />
      <SharedHookStateBrother />
    </div>
  );
};

const SharedHookStateSister = () => {
  const { volume, updateVolume } = useVolume();

  return (
    <div>
      <h3>Sister`s Volume: {volume}</h3>

      <input
        type="range"
        value={volume}
        min={0}
        max={100}
        onChange={(event) => updateVolume(Number(event.target.value))}
      />
    </div>
  );
};

const SharedHookStateBrother = () => {
  const { volume, updateVolume } = useVolume();

  return (
    <div>
      <h3>Brother`s Volume: {volume}</h3>

      <input
        type="range"
        value={volume}
        min={0}
        max={100}
        onChange={(event) => updateVolume(Number(event.target.value))}
      />
    </div>
  );
};
