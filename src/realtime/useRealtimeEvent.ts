import { useEffect } from 'react';
import { RealtimeEventName } from './events';

export function useRealtimeEvent<TDetail>(
  eventName: RealtimeEventName,
  handler: (detail: TDetail) => void
): void {
  useEffect(() => {
    const listener = (event: Event) => {
      handler((event as CustomEvent<TDetail>).detail);
    };

    window.addEventListener(eventName, listener);

    return () => {
      window.removeEventListener(eventName, listener);
    };
  }, [eventName, handler]);
}
