import { BroadcastMessage } from '$broadcast/types';

/** Create a broadcast message object from arguments. */
const createMessage = <Payload, Type extends string = string>(
  eventType: Type,
  payload?: Payload
): BroadcastMessage<Payload, Type> => {
  return { eventType, payload };
};

export default createMessage;
