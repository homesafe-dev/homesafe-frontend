import React, { useState } from 'react';
import { IoCheckmarkCircleOutline, IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  location: string;
  read: boolean;
  timestamp: string;
}

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  // State for notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'Placement',
      title: 'Placement',
      location: "Akinola' House, Lagos State",
      read: false,
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      type: 'Placement',
      title: 'Placement',
      location: "Akinola' House, Lagos State",
      read: false,
      timestamp: '',
    },
    {
      id: '3',
      type: 'Placement',
      title: 'Placement',
      location: "Akinola' House, Lagos State",
      read: false,
      timestamp: '',
    },
  ]);

  // State for active tab
  const [activeTab, setActiveTab] = useState<'unread' | 'read'>('unread');

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const handleBack = () => {
    navigate(-1); // Goes back one step in history
  };

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
            Unread (5)
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
          className="flex items-center gap-1 border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
          onClick={handleMarkAllAsRead}
        >
          <span>Mark As Read</span>
          <IoCheckmarkCircleOutline size={16} />
        </button>
      </div>

      <div className="shadow-lg rounded-md overflow-hidden border border-gray-200">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer relative ${
              index !== notifications.length - 1
                ? 'border-b border-gray-200'
                : ''
            }`}
          >
            <div className="absolute left-4 top-5 w-1 h-1 bg-gray-300 rounded-full"></div>

            <div className="pl-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-800">
                    {notification.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {notification.location}
                  </p>
                </div>
                {notification.timestamp && (
                  <span className="text-xs text-gray-500">
                    {notification.timestamp}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
