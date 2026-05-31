import React, { useState, useEffect, useCallback } from 'react';
import {
  IoEyeOutline,
  IoNotificationsOutline,
  IoCheckmarkCircleOutline,
} from 'react-icons/io5';
import { Link } from 'react-router-dom';
import notificationApi from '../../api/notificationApi';
import {
  NotificationItem,
  convertApiNotificationToUI,
} from '../../types/notification';

type NotificationFilter = 'unread' | 'all';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  portalType: 'employer' | 'employee' | 'agent' | 'admin';
  onUnreadCountChange?: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  portalType,
  onUnreadCountChange,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<NotificationFilter>('unread');

  const getViewAllRoute = () => {
    switch (portalType) {
      case 'employer':
        return '/employer/notifications';
      case 'employee':
        return '/employee/notifications';
      case 'agent':
        return '/agent/notifications';
      case 'admin':
        return '/admin/notifications';
      default:
        return '/notifications';
    }
  };

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response =
        filter === 'unread'
          ? await notificationApi.getUnreadNotifications(5)
          : await notificationApi.getNotifications({ per_page: 5 });

      if (response.status) {
        const list = notificationApi.parseNotificationList(response);
        setNotifications(list.map(convertApiNotificationToUI));
      } else {
        setError(response.message || 'Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationApi.markAllAsRead();
      if (response.status) {
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, read: true }))
        );
        onUnreadCountChange?.();
        if (filter === 'unread') {
          setNotifications([]);
        }
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
      setError('Failed to mark notifications as read');
    }
  };

  const handleViewNotification = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
      onUnreadCountChange?.();
      if (filter === 'unread') {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  if (!isOpen) return null;

  const unreadInList = notifications.filter((n) => !n.read).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end pr-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg min-w-[400px] bg-white dark:bg-gray-800 shadow-lg mt-16 rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Notifications
            </h2>
            <button
              type="button"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-2 disabled:opacity-50"
              onClick={handleMarkAllAsRead}
              disabled={loading || unreadInList === 0}
            >
              <span className="text-sm">Mark all as Read</span>
              <IoCheckmarkCircleOutline size={20} />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                filter === 'unread'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Unread
            </button>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                filter === 'all'
                  ? 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              All
            </button>
          </div>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {loading ? (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              Loading notifications...
            </div>
          ) : error ? (
            <div className="px-6 py-8 text-center text-red-500">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 min-h-[200px] flex flex-col justify-center">
              <IoNotificationsOutline
                size={48}
                className="mx-auto mb-4 text-gray-300"
              />
              <p className="text-base">
                {filter === 'unread'
                  ? 'No unread notifications'
                  : 'No notifications yet'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                You&apos;ll see your notifications here when they arrive
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 relative"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="relative">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2">
                        {notification.avatar ? (
                          <img
                            src={notification.avatar}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <IoNotificationsOutline
                            size={18}
                            className="text-gray-500 dark:text-gray-400"
                          />
                        )}
                      </div>
                      {!notification.read && (
                        <div className="absolute -left-1 top-0 w-2 h-2 bg-blue-600 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleViewNotification(notification.id)}
                        className="mt-3 flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm transition-colors"
                      >
                        <IoEyeOutline size={16} />
                        <span>Mark as read</span>
                      </button>
                    </div>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap ml-2">
                    {notification.date}
                  </span>
                </div>
              </div>
            ))
          )}

          {!loading && !error && notifications.length > 0 && (
            <div className="px-6 mt-8 mb-4 flex justify-end">
              <Link to={getViewAllRoute()}>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[#48525B] dark:text-gray-300 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  View all
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
