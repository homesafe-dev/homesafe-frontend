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
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <IoCheckmarkCircleOutline size={20} className="text-white" />
        );
      case 'error':
        return <IoCloseCircleOutline size={20} className="text-white" />;
      case 'info':
        return (
          <IoInformationCircleOutline size={20} className="text-white" />
        );
      default:
        return (
          <IoInformationCircleOutline size={20} className="text-white" />
        );
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
      <div className="pointer-events-auto">
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-md min-w-[300px] transform transition-all duration-300 ease-in-out ${getToastStyles()} ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
        >
          {getIcon()}
          <span className="text-sm font-medium flex-1">{message}</span>
          <button
            onClick={onClose}
            className="ml-2 text-white hover:text-gray-200 transition-colors"
          >
            <IoCloseCircleOutline size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
