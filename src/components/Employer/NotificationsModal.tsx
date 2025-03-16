import React from 'react';
import { IoEyeOutline } from 'react-icons/io5';
import { IoNotificationsOutline } from 'react-icons/io5';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'medical' | 'salary' | 'other';
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onViewNotification: (id: string) => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onViewNotification,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-y-0 right-4 z-50 flex items-start"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white shadow-lg mt-16"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800">Notifications</h2>
          <button
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
            onClick={onMarkAllAsRead}
          >
            <span className="text-sm">Mark all as Read</span>
            <IoCheckmarkCircleOutline size={20} />
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-[600px] overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="border-b border-gray-200 px-6 py-4 relative"
            >
              {/* Notification content */}
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="relative">
                    <div className="bg-gray-100 rounded-full p-2">
                      <IoNotificationsOutline
                        size={18}
                        className="text-gray-500"
                      />
                    </div>
                    {/* Unread indicator */}
                    {!notification.read && (
                      <div className="absolute -left-1 top-0 w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {notification.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {notification.message}
                    </p>
                    <button
                      onClick={() => onViewNotification(notification.id)}
                      className="mt-3 flex items-center gap-2 text-gray-500 hover:text-gray-700 py-2 px-4 border border-gray-300 rounded-md text-sm"
                    >
                      <IoEyeOutline size={16} />
                      <span>View</span>
                    </button>
                  </div>
                </div>
                <span className="text-gray-500 text-sm">
                  {notification.date}
                </span>
              </div>
            </div>
          ))}

          {/* View all link */}
          <div className="px-6 mt-8 mb-4 flex justify-end">
            <Link to="/employer/notifications">
              <button
                onClick={onClose}
                className="text-[#48525B] hover:text-blue-700 text-sm font-medium"
              >
                View all
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
