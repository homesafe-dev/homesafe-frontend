import React, { useState, useEffect } from 'react';
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

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  portalType: 'employer' | 'employee' | 'agent' | 'admin';
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  portalType,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the appropriate route for "View all" based on portal type
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

  // Fetch notifications from API
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await notificationApi.getNotifications();

      if (response.status && response.data) {
        const uiNotifications = response.data.map(convertApiNotificationToUI);
        setNotifications(uiNotifications);
      } else {
        setError(response.message || 'Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();

      // Update local state
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (err) {
      console.error('Error marking all as read:', err);
      setError('Failed to mark notifications as read');
    }
  };

  // Mark individual notification as read
  const handleViewNotification = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);

      // Update local state
      setNotifications(
        notifications.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Fetch notifications when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end pr-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg min-w-[400px] bg-white shadow-lg mt-16 rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800">Notifications</h2>
          <button
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2 disabled:opacity-50"
            onClick={handleMarkAllAsRead}
            disabled={loading || notifications.every((n) => n.read)}
          >
            <span className="text-sm">Mark all as Read</span>
            <IoCheckmarkCircleOutline size={20} />
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-[600px] overflow-y-auto">
          {loading ? (
            <div className="px-6 py-8 text-center text-gray-500">
              Loading notifications...
            </div>
          ) : error ? (
            <div className="px-6 py-8 text-center text-red-500">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 min-h-[200px] flex flex-col justify-center">
              <IoNotificationsOutline
                size={48}
                className="mx-auto mb-4 text-gray-300"
              />
              <p className="text-base">No notifications yet</p>
              <p className="text-sm text-gray-400 mt-2">
                You'll see your notifications here when they arrive
              </p>
            </div>
          ) : (
            notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className="border-b border-gray-200 px-6 py-4 relative"
              >
                {/* Notification content */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="relative">
                      <div className="bg-gray-100 rounded-full p-2">
                        {notification.avatar ? (
                          <img
                            src={notification.avatar}
                            alt="User"
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <IoNotificationsOutline
                            size={18}
                            className="text-gray-500"
                          />
                        )}
                      </div>
                      {!notification.read && (
                        <div className="absolute -left-1 top-0 w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <button
                        onClick={() => handleViewNotification(notification.id)}
                        className="mt-3 flex items-center gap-2 text-gray-500 hover:text-gray-700 py-2 px-4 border border-gray-300 rounded-md text-sm transition-colors"
                      >
                        <IoEyeOutline size={16} />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                  <span className="text-gray-500 text-sm whitespace-nowrap ml-2">
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
                  onClick={onClose}
                  className="text-[#48525B] hover:text-blue-700 text-sm font-medium transition-colors"
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
