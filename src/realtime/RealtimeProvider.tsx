import { ReactNode, useEffect, useRef } from 'react';
import userApi from '../api/userApi';
import { useAuth } from '../contexts/useAuth';
import { createEcho } from './echo';
import {
  NotificationReceivedDetail,
  REALTIME_EVENTS,
  TransactionCreatedDetail,
  WalletBalanceUpdatedDetail,
} from './events';
import type Echo from 'laravel-echo';

const isDev = import.meta.env.DEV;

function dispatchRealtimeEvent<T>(name: string, detail: T): void {
  if (isDev) {
    console.info('[Realtime]', name, detail);
  }

  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const echoRef = useRef<Echo<'reverb'> | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      if (echoRef.current) {
        echoRef.current.disconnect();
        echoRef.current = null;
      }

      return;
    }

    let cancelled = false;

    const connect = async () => {
      let userId = user?.id ? String(user.id) : null;

      try {
        const profileResponse = await userApi.getProfile();

        if (profileResponse.status && profileResponse.data?.id) {
          userId = String(profileResponse.data.id);
        }
      } catch (error) {
        console.error(
          '[Realtime] Failed to resolve user id from profile',
          error
        );
      }

      if (cancelled || !userId) {
        return;
      }

      const echo = createEcho(token);

      if (!echo) {
        console.warn(
          '[Realtime] Echo not created — check VITE_REVERB_* env vars'
        );
        return;
      }

      echoRef.current = echo;

      if (isDev) {
        console.info('[Realtime] Connecting to private-user.' + userId);
      }

      const channel = echo.private(`user.${userId}`);

      channel.subscribed(() => {
        if (isDev) {
          console.info('[Realtime] Subscribed to private-user.' + userId);
        }
      });

      channel.error((error: unknown) => {
        console.error('[Realtime] Channel error', error);
      });

      channel.listen(
        '.wallet.balance.updated',
        (payload: WalletBalanceUpdatedDetail) => {
          dispatchRealtimeEvent(
            REALTIME_EVENTS.WALLET_BALANCE_UPDATED,
            payload
          );
        }
      );

      channel.listen(
        '.transaction.created',
        (payload: TransactionCreatedDetail) => {
          dispatchRealtimeEvent(REALTIME_EVENTS.TRANSACTION_CREATED, payload);
        }
      );

      channel.listen(
        '.notification.received',
        (payload: NotificationReceivedDetail) => {
          dispatchRealtimeEvent(REALTIME_EVENTS.NOTIFICATION_RECEIVED, payload);
        }
      );
    };

    void connect();

    return () => {
      cancelled = true;

      if (echoRef.current) {
        echoRef.current.disconnect();
        echoRef.current = null;
      }
    };
  }, [user?.id]);

  return <>{children}</>;
}
