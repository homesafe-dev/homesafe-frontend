import axiosInstance from './axiosConfig';

// Notification API endpoints
const NOTIFICATION_ENDPOINTS = {
  GET_NOTIFICATIONS: '/notifications',
  MARK_AS_READ: (id: string) => `/notifications/${id}/mark-as-read`,
};

// Notification API service
const notificationApi = {
  /**
   * Get all notifications for the current user
   * @returns Promise with the API response containing notifications data
   */
  getNotifications: async () => {
    try {
      const response = await axiosInstance.get(
        NOTIFICATION_ENDPOINTS.GET_NOTIFICATIONS
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  /**
   * Mark a specific notification as read
   * @param notificationId - ID of the notification to mark as read
   * @returns Promise with the API response
   */
  markAsRead: async (notificationId: string) => {
    try {
      const response = await axiosInstance.patch(
        NOTIFICATION_ENDPOINTS.MARK_AS_READ(notificationId)
      );
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   * @returns Promise with the API response
   */
  markAllAsRead: async () => {
    try {
      // First get all notifications
      const notificationsResponse = await notificationApi.getNotifications();

      if (notificationsResponse.status && notificationsResponse.data) {
        // Mark each unread notification as read
        const unreadNotifications = notificationsResponse.data.filter(
          (notification: any) => !notification.read_at
        );

        const markAsReadPromises = unreadNotifications.map(
          (notification: any) => notificationApi.markAsRead(notification.id)
        );

        await Promise.all(markAsReadPromises);

        return { status: true, message: 'All notifications marked as read' };
      }

      return notificationsResponse;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },
};

export default notificationApi;
