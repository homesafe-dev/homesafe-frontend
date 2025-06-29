import { describe, it, expect, vi, beforeEach } from 'vitest';
import notificationApi from '../notificationApi';
import axiosInstance from '../axiosConfig';

// Mock axios instance
vi.mock('../axiosConfig', () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockAxios = axiosInstance as any;

describe('notificationApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('should fetch notifications successfully', async () => {
      const mockResponse = {
        data: {
          status: true,
          message: 'Notifications retrieved successfully',
          data: [
            {
              id: '1',
              type: 'App\\Notifications\\WalletTransactionNotification',
              notifiable_type: 'App\\Models\\User',
              notifiable_id: 1,
              data: {
                user: {
                  id: 1,
                  first_name: 'John',
                  last_name: 'Doe',
                  email: 'john@example.com',
                  avatar: 'avatar.jpg',
                },
                message: 'You transferred 100.00 to Jane.',
              },
              read_at: null,
              created_at: '2025-03-12T23:21:55.000000Z',
              updated_at: '2025-03-12T23:21:55.000000Z',
            },
          ],
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await notificationApi.getNotifications();

      expect(mockAxios.get).toHaveBeenCalledWith('/notifications');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle errors when fetching notifications', async () => {
      const mockError = new Error('Network error');
      mockAxios.get.mockRejectedValue(mockError);

      await expect(notificationApi.getNotifications()).rejects.toThrow(
        'Network error'
      );
      expect(mockAxios.get).toHaveBeenCalledWith('/notifications');
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read successfully', async () => {
      const notificationId = '123';
      const mockResponse = {
        data: {
          status: true,
          message: 'Notification marked as read.',
          data: {
            id: notificationId,
            read_at: '2025-03-13T22:09:11.000000Z',
          },
        },
      };

      mockAxios.patch.mockResolvedValue(mockResponse);

      const result = await notificationApi.markAsRead(notificationId);

      expect(mockAxios.patch).toHaveBeenCalledWith(
        `/notifications/${notificationId}/mark-as-read`
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle errors when marking notification as read', async () => {
      const notificationId = '123';
      const mockError = new Error('Network error');
      mockAxios.patch.mockRejectedValue(mockError);

      await expect(notificationApi.markAsRead(notificationId)).rejects.toThrow(
        'Network error'
      );
      expect(mockAxios.patch).toHaveBeenCalledWith(
        `/notifications/${notificationId}/mark-as-read`
      );
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read successfully', async () => {
      const mockGetResponse = {
        data: {
          status: true,
          data: [
            {
              id: '1',
              read_at: null,
            },
            {
              id: '2',
              read_at: null,
            },
          ],
        },
      };

      const mockPatchResponse = {
        data: {
          status: true,
          message: 'Notification marked as read.',
        },
      };

      mockAxios.get.mockResolvedValue(mockGetResponse);
      mockAxios.patch.mockResolvedValue(mockPatchResponse);

      const result = await notificationApi.markAllAsRead();

      expect(mockAxios.get).toHaveBeenCalledWith('/notifications');
      expect(mockAxios.patch).toHaveBeenCalledTimes(2);
      expect(mockAxios.patch).toHaveBeenCalledWith(
        '/notifications/1/mark-as-read'
      );
      expect(mockAxios.patch).toHaveBeenCalledWith(
        '/notifications/2/mark-as-read'
      );
      expect(result).toEqual({
        status: true,
        message: 'All notifications marked as read',
      });
    });

    it('should handle case when no unread notifications exist', async () => {
      const mockGetResponse = {
        data: {
          status: true,
          data: [
            {
              id: '1',
              read_at: '2025-03-13T22:09:11.000000Z',
            },
          ],
        },
      };

      mockAxios.get.mockResolvedValue(mockGetResponse);

      const result = await notificationApi.markAllAsRead();

      expect(mockAxios.get).toHaveBeenCalledWith('/notifications');
      expect(mockAxios.patch).not.toHaveBeenCalled();
      expect(result).toEqual({
        status: true,
        message: 'All notifications marked as read',
      });
    });
  });
});
