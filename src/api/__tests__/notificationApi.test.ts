import { describe, it, expect, vi, beforeEach } from 'vitest';
import notificationApi from '../notificationApi';
import axiosInstance from '../axiosConfig';

vi.mock('../axiosConfig', () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockAxios = axiosInstance as unknown as {
  get: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
};

describe('notificationApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('fetches notifications with filters', async () => {
      const mockResponse = {
        data: {
          status: true,
          message: 'Notifications retrieved successfully',
          data: {
            data: [
              {
                id: '1',
                type: 'App\\Notifications\\WalletTransactionNotification',
                data: { message: 'Test' },
                read_at: null,
                created_at: '2025-03-12T23:21:55.000000Z',
                updated_at: '2025-03-12T23:21:55.000000Z',
              },
            ],
            current_page: 1,
            per_page: 15,
            total: 1,
          },
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await notificationApi.getNotifications({
        read: false,
        per_page: 15,
      });

      expect(mockAxios.get).toHaveBeenCalledWith('/notifications', {
        params: { read: false, per_page: 15 },
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getUnreadNotifications', () => {
    it('fetches unread notifications', async () => {
      mockAxios.get.mockResolvedValue({
        data: { status: true, data: { data: [] } },
      });

      await notificationApi.getUnreadNotifications(15, 1);

      expect(mockAxios.get).toHaveBeenCalledWith('/notifications/unread', {
        params: { per_page: 15, page: 1 },
      });
    });
  });

  describe('getUnreadCount', () => {
    it('fetches unread count for badge', async () => {
      mockAxios.get.mockResolvedValue({
        data: {
          status: true,
          data: { unread_count: 3 },
        },
      });

      const result = await notificationApi.getUnreadCount();

      expect(mockAxios.get).toHaveBeenCalledWith('/notifications/unread-count');
      expect(result.data.unread_count).toBe(3);
    });
  });

  describe('markAsRead', () => {
    it('marks notification as read', async () => {
      const notificationId = '123';
      mockAxios.patch.mockResolvedValue({
        data: { status: true, message: 'Notification marked as read.' },
      });

      await notificationApi.markAsRead(notificationId);

      expect(mockAxios.patch).toHaveBeenCalledWith(
        `/notifications/${notificationId}/mark-as-read`
      );
    });
  });

  describe('markAllAsRead', () => {
    it('marks all notifications as read via dedicated endpoint', async () => {
      mockAxios.patch.mockResolvedValue({
        data: { status: true, message: 'All notifications marked as read.' },
      });

      const result = await notificationApi.markAllAsRead();

      expect(mockAxios.patch).toHaveBeenCalledWith(
        '/notifications/mark-all-as-read'
      );
      expect(result.status).toBe(true);
    });
  });

  describe('parseNotificationList', () => {
    it('extracts items from paginated response', () => {
      const list = notificationApi.parseNotificationList({
        status: true,
        data: {
          data: [{ id: 'a', type: 'x', data: { message: 'hi' } }],
        },
      });

      expect(list).toHaveLength(1);
      expect(list[0].id).toBe('a');
    });
  });
});
