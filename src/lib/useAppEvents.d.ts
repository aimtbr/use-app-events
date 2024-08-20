import { UseAppEventsReturn } from '$types';
type UseAppEventsProps = {
    debug?: boolean;
};
/** Manage events throughout the app. */
export declare function useAppEvents<EventType extends string>(props?: UseAppEventsProps): UseAppEventsReturn<EventType>;
export {};
