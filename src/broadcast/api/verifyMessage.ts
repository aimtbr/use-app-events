import { BroadcastMessage } from '$broadcast/types';

/** Verify if a message is a valid broadcast message. */
export const verifyMessage = (message: BroadcastMessage): boolean => {
  if (!message || typeof message?.eventType !== 'string') {
    return false;
  }

  return true;
};
