import { broadcastChannel } from '$broadcast/init';

/** Broadcast a message to other browsing contexts (tabs, windows, etc.). */
const broadcastMessage = (message: unknown) => {
  if (broadcastChannel) {
    broadcastChannel.postMessage(message);
  }
};

export default broadcastMessage;
