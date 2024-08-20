import { EventType } from '$examples/constants';
import { useAppEvents } from '$lib/useAppEvents';
import { useState } from 'react';

/**
 * The example describes the potential implementation of the useVolume hook,
 * which allows managing a volume from any component of the app.
 */
const useVolume = () => {
  const [volume, setVolume] = useState<number>(100);

  const { notifyEventListeners, listenForEvents } = useAppEvents({
    debug: true,
  });

  // If any other instance of the useVolume hook has its volume state updated
  listenForEvents(EventType.VOLUME_CHANGE, (volumeNext: number) => {
    // synchronize the volume value of this instance, with a new one
    setVolume(volumeNext);
  });

  const updateVolume = (volumeNext: number) => {
    setVolume(volumeNext);

    // Notify all other useVolume hook instances about the changed volume value
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
    <>
      <h2>Shared hook state</h2>

      <SharedHookStateSister />
      <SharedHookStateBrother />
    </>
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
