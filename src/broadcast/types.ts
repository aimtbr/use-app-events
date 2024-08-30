export type BroadcastMessage<
  Payload = unknown,
  Type extends string = string
> = {
  eventType: Type;
  payload?: Payload;
};
