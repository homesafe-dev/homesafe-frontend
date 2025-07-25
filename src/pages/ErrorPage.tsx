import React from 'react';
import {
  useNavigate,
  useRouteError,
  isRouteErrorResponse,
} from 'react-router-dom';
import { FaHome, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import { IoRefreshOutline } from 'react-icons/io5';

interface ErrorPageProps {
  error?: Error | null;
  resetError?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, resetError }) => {
  const navigate = useNavigate();
  const routeError = useRouteError();

  // Determine the error to display
  const displayError = error || routeError;

  // Check if it's a 404 error
  const is404 =
    isRouteErrorResponse(displayError) && displayError.status === 404;

  // Get error message
  const getErrorMessage = () => {
    if (is404) {
      return "The page you're looking for doesn't exist.";
    }

    if (isRouteErrorResponse(displayError)) {
      return (
        displayError.statusText ||
        displayError.data?.message ||
        'An unexpected error occurred.'
      );
    }

    if (displayError instanceof Error) {
      return displayError.message;
    }

    return 'Something went wrong. Please try again.';
  };

  // Get error title
  const getErrorTitle = () => {
    if (is404) {
      return 'Page Not Found';
    }

    if (isRouteErrorResponse(displayError)) {
      return `Error ${displayError.status}`;
    }

    return 'Oops! Something went wrong';
  };

  // Get error code
  const getErrorCode = () => {
    if (isRouteErrorResponse(displayError)) {
      return displayError.status.toString();
    }
    return is404 ? '404' : '500';
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Error Icon and Code */}
        <div className="flex flex-col items-center">
          <div className="bg-red-100 rounded-full p-6 mb-4">
            <FaExclamationTriangle className="h-12 w-12 text-red-600" />
          </div>
          <div className="text-6xl font-bold text-gray-300 mb-2">
            {getErrorCode()}
          </div>
        </div>

        {/* Error Title and Message */}
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            {getErrorTitle()}
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            {getErrorMessage()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center px-6 py-3 bg-[#A5EA91] text-[#174B35] rounded-lg font-medium hover:bg-[#95D981] transition-colors duration-200"
            >
              <FaHome className="mr-2 h-4 w-4" />
              Go Home
            </button>

            <button
              onClick={handleGoBack}
              className="flex items-center justify-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </button>
          </div>

          {/* Refresh button for non-404 errors */}
          {!is404 && (
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 mx-auto"
            >
              <IoRefreshOutline className="mr-2 h-4 w-4" />
              Try Again
            </button>
          )}
        </div>

        {/* Additional Help Text */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {is404
              ? 'If you believe this is a mistake, please check the URL or contact support.'
              : 'If the problem persists, please contact our support team.'}
          </p>
        </div>

        {/* Development Error Details */}
        {process.env.NODE_ENV === 'development' && displayError && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Development Only)
            </summary>
            <div className="mt-2 p-4 bg-gray-100 rounded-lg text-xs text-gray-700 overflow-auto">
              <pre className="whitespace-pre-wrap">
                {displayError instanceof Error
                  ? displayError.stack || displayError.message
                  : JSON.stringify(displayError, null, 2)}
              </pre>
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
