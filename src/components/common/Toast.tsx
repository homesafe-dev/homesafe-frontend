import React, { useEffect } from 'react';
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoInformationCircleOutline,
} from 'react-icons/io5';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-400 text-red-700';
      case 'info':
        return 'bg-blue-100 border-blue-400 text-blue-700';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-700';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <IoCheckmarkCircleOutline size={20} className="text-green-600" />
        );
      case 'error':
        return <IoCloseCircleOutline size={20} className="text-red-600" />;
      case 'info':
        return (
          <IoInformationCircleOutline size={20} className="text-blue-600" />
        );
      default:
        return (
          <IoInformationCircleOutline size={20} className="text-gray-600" />
        );
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg max-w-md ${getToastStyles()}`}
      >
        {getIcon()}
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-auto text-gray-500 hover:text-gray-700"
        >
          <IoCloseCircleOutline size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
