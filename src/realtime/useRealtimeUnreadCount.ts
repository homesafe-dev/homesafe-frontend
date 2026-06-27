import { useCallback } from 'react';
import notificationApi from '../api/notificationApi';
import { NotificationReceivedDetail, REALTIME_EVENTS } from './events';
import { useRealtimeEvent } from './useRealtimeEvent';

export function useRealtimeUnreadCount(
  setUnreadCount: (count: number) => void
): void {
  const refreshUnreadCount = useCallback(async () => {
    try {
      const response = await notificationApi.getUnreadCount();

      if (response.status && response.data) {
        setUnreadCount(response.data.unread_count ?? 0);
      }
    } catch (error) {
      console.error('[Realtime] Failed to refresh unread count', error);
    }
  }, [setUnreadCount]);

  useRealtimeEvent<NotificationReceivedDetail>(
    REALTIME_EVENTS.NOTIFICATION_RECEIVED,
    (detail) => {
      if (typeof detail.unread_count === 'number') {
        setUnreadCount(detail.unread_count);
        return;
      }

      void refreshUnreadCount();
    }
  );
}
