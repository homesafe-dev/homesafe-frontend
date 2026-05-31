import axiosInstance from './axiosConfig';
import {
  extractNotificationsList,
  type NotificationListFilters,
} from '../types/notification';

const NOTIFICATION_ENDPOINTS = {
  LIST: '/notifications',
  UNREAD: '/notifications/unread',
  UNREAD_COUNT: '/notifications/unread-count',
  MARK_ALL_AS_READ: '/notifications/mark-all-as-read',
  MARK_AS_READ: (id: string) => `/notifications/${id}/mark-as-read`,
};

const notificationApi = {
  getNotifications: async (filters: NotificationListFilters = {}) => {
    const response = await axiosInstance.get(NOTIFICATION_ENDPOINTS.LIST, {
      params: filters,
    });
    return response.data;
  },

  getUnreadNotifications: async (perPage = 15, page = 1) => {
    const response = await axiosInstance.get(NOTIFICATION_ENDPOINTS.UNREAD, {
      params: { per_page: perPage, page },
    });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await axiosInstance.get(
      NOTIFICATION_ENDPOINTS.UNREAD_COUNT
    );
    return response.data;
  },

  markAsRead: async (notificationId: string) => {
    const response = await axiosInstance.patch(
      NOTIFICATION_ENDPOINTS.MARK_AS_READ(notificationId)
    );
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axiosInstance.patch(
      NOTIFICATION_ENDPOINTS.MARK_ALL_AS_READ
    );
    return response.data;
  },

  /** Parse notification array from list/unread API responses. */
  parseNotificationList: (response: { status?: boolean; data?: unknown }) =>
    extractNotificationsList(response),
};

export default notificationApi;
