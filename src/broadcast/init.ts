import { base_createNotifyEventListeners } from '$base/notifyEventListeners/notifyEventListeners';
import { verifyMessage } from './utils/verifyMessage';
import { BroadcastMessage } from './types';

let broadcastChannel: BroadcastChannel | null = null;

if (globalThis?.BroadcastChannel) {
  broadcastChannel = new BroadcastChannel('use-app-events:channel');

  if (broadcastChannel?.addEventListener) {
    // 1. If a message containing an event comes from another browsing context.
    broadcastChannel.addEventListener(
      'message',
      (event: MessageEvent<BroadcastMessage>) => {
        const data = event.data;

        // 2. Check if the received message is valid.
        if (verifyMessage(data)) {
          const { eventType, payload } = data;

          // 3. Notify the local event listeners about the event that occurred.
          base_createNotifyEventListeners()(eventType, payload, false);
        }
      }
    );
  }
}

export { broadcastChannel };
