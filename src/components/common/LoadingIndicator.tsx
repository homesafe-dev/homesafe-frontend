import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
  showMessage?: boolean;
}

/**
 * A reusable loading indicator component
 */
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Loading...',
  showMessage = false
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[150px]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      {showMessage && <p className="mt-3 text-gray-600 text-sm">{message}</p>}
    </div>
  );
};

export default LoadingIndicator;
