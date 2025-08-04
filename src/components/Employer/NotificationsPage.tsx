import React, { useState, useEffect, useCallback } from 'react';
import {
  IoCheckmarkCircleOutline,
  IoArrowBack,
  IoNotificationsOutline,
} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import notificationApi from '../../api/notificationApi';
import {
  NotificationItem,
  convertApiNotificationToUI,
} from '../../types/notification';
import Toast from '../common/Toast';

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();

  // State for notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for active tab
  const [activeTab, setActiveTab] = useState<'unread' | 'read'>('unread');

  // Toast state
  const [toast, setToast] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
    isVisible: false,
  });

  // Toast helper functions
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  // Memoize fetchNotifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationApi.getNotifications();
      if (response.status && response.data) {
        const uiNotifications = response.data.map(convertApiNotificationToUI);
        setNotifications(uiNotifications);
      } else {
        const errorMessage =
          response.message || 'Failed to fetch notifications';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      const errorMessage = 'Failed to load notifications';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark all as read
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
      const errorMessage = 'Failed to mark notifications as read';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  // Mark individual notification as read
  const handleNotificationClick = async (id: string) => {
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
      showToast('Failed to mark notification as read', 'error');
    }
  };

  const handleBack = () => {
    navigate(-1); // Goes back one step in history
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) =>
    activeTab === 'unread' ? !notification.read : notification.read
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="bg-white p-6">
      <div className="flex items-center mb-1">
        <IoArrowBack
          className="text-gray-600 mr-2 cursor-pointer"
          size={20}
          onClick={handleBack}
        />
        <h1 className="text-lg font-medium">Notification</h1>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Keep track of all your notifications
      </p>

      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

      <div className="flex justify-between mb-6">
        {/* Tabs */}
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md text-sm ${
              activeTab === 'unread'
                ? 'bg-orange-100 text-orange-800'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm ${
              activeTab === 'read'
                ? 'bg-gray-200 text-gray-800'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('read')}
          >
            Read
          </button>
        </div>

        <button
          className="flex items-center gap-1 border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          onClick={handleMarkAllAsRead}
          disabled={loading || unreadCount === 0}
        >
          <span>Mark As Read</span>
          <IoCheckmarkCircleOutline size={16} />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">
          Loading notifications...
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <IoNotificationsOutline
            size={48}
            className="mx-auto mb-4 text-gray-300"
          />
          <p>No {activeTab} notifications</p>
        </div>
      ) : (
        <div className="shadow-lg rounded-md overflow-hidden border border-gray-200">
          {filteredNotifications.map((notification, index) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer relative ${
                index !== filteredNotifications.length - 1
                  ? 'border-b border-gray-200'
                  : ''
              }`}
              onClick={() => handleNotificationClick(notification.id)}
            >
              <div className="flex items-start gap-3">
                {/* Notification icon/avatar */}
                <div className="relative">
                  <div className="bg-gray-100 rounded-full p-2">
                    {notification.avatar ? (
                      <img
                        src={notification.avatar}
                        alt="User"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <IoNotificationsOutline
                        size={20}
                        className="text-gray-500"
                      />
                    )}
                  </div>
                  {!notification.read && (
                    <div className="absolute -left-1 top-0 w-3 h-3 bg-blue-600 rounded-full"></div>
                  )}
                </div>

                {/* Notification content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className={`font-medium ${notification.read ? 'text-gray-600' : 'text-gray-800'}`}
                      >
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            notification.type === 'wallet'
                              ? 'bg-green-100 text-green-800'
                              : notification.type === 'medical'
                                ? 'bg-blue-100 text-blue-800'
                                : notification.type === 'salary'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : notification.type === 'placement'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {notification.type}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {notification.date}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default NotificationsPage;
