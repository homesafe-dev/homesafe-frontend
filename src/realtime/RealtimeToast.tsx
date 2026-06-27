import { useCallback, useEffect, useState } from 'react';
import {
  NotificationReceivedDetail,
  REALTIME_EVENTS,
  WalletBalanceUpdatedDetail,
} from './events';
import { useRealtimeEvent } from './useRealtimeEvent';

export function RealtimeToast() {
  const [message, setMessage] = useState<string | null>(null);

  const show = useCallback((text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 5000);
  }, []);

  useRealtimeEvent<WalletBalanceUpdatedDetail>(
    REALTIME_EVENTS.WALLET_BALANCE_UPDATED,
    (detail) => {
      show(`Wallet updated live: ₦${Number(detail.balance).toLocaleString()}`);
    }
  );

  useRealtimeEvent<NotificationReceivedDetail>(
    REALTIME_EVENTS.NOTIFICATION_RECEIVED,
    (detail) => {
      show(detail.message || detail.title || 'New notification received');
    }
  );

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMessage(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (!message) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] max-w-sm rounded-lg border border-green-500/40 bg-green-950 px-4 py-3 text-sm text-green-100 shadow-lg">
      <div className="font-semibold text-green-300">Live update</div>
      <div>{message}</div>
    </div>
  );
}
