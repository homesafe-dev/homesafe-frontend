/**
 * Utility functions for handling errors throughout the application
 */

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * Extracts a user-friendly error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
  // Handle API response errors
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as any;

    // Check for response data message
    if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    }

    // Check for response status text
    if (apiError.response?.statusText) {
      return apiError.response.statusText;
    }

    // Handle specific status codes
    if (apiError.response?.status) {
      switch (apiError.response.status) {
        case 400:
          return 'Bad request. Please check your input and try again.';
        case 401:
          return 'You are not authorized to perform this action.';
        case 403:
          return 'Access denied. You do not have permission to access this resource.';
        case 404:
          return 'The requested resource was not found.';
        case 408:
          return 'Request timeout. Please try again.';
        case 429:
          return 'Too many requests. Please wait a moment and try again.';
        case 500:
          return 'Internal server error. Please try again later.';
        case 502:
          return 'Bad gateway. The server is temporarily unavailable.';
        case 503:
          return 'Service unavailable. Please try again later.';
        case 504:
          return 'Gateway timeout. The server is taking too long to respond.';
        default:
          return `An error occurred (${apiError.response.status}). Please try again.`;
      }
    }
  }

  // Handle Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle objects with message property
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as any).message);
  }

  // Default fallback
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Checks if an error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error && typeof error === 'object' && 'code' in error) {
    const networkError = error as any;
    return (
      networkError.code === 'NETWORK_ERROR' ||
      networkError.code === 'ECONNABORTED' ||
      networkError.message?.includes('Network Error')
    );
  }
  return false;
};

/**
 * Checks if an error is a timeout error
 */
export const isTimeoutError = (error: unknown): boolean => {
  if (error && typeof error === 'object') {
    const timeoutError = error as any;
    return (
      timeoutError.code === 'ECONNABORTED' ||
      timeoutError.message?.includes('timeout') ||
      timeoutError.response?.status === 408
    );
  }
  return false;
};

/**
 * Checks if an error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  if (error && typeof error === 'object' && 'response' in error) {
    const authError = error as any;
    return (
      authError.response?.status === 401 || authError.response?.status === 403
    );
  }
  return false;
};

/**
 * Creates a standardized error object
 */
export const createApiError = (
  message: string,
  status?: number,
  code?: string
): ApiError => {
  return {
    message,
    status,
    code,
  };
};

/**
 * Logs errors to console in development and potentially to external service in production
 */
export const logError = (error: unknown, context?: string): void => {
  const errorMessage = getErrorMessage(error);
  const logContext = context ? `[${context}]` : '';

  if (process.env.NODE_ENV === 'development') {
    console.error(`${logContext} Error:`, error);
  } else {
    // In production, you might want to send errors to an external logging service
    // Example: sendToLoggingService(error, context);
    console.error(`${logContext} ${errorMessage}`);
  }
};

/**
 * Handles common error scenarios and returns appropriate user messages
 */
export const handleApiError = (error: unknown, context?: string): string => {
  logError(error, context);

  if (isNetworkError(error)) {
    return 'Network connection error. Please check your internet connection and try again.';
  }

  if (isTimeoutError(error)) {
    return 'Request timed out. Please try again.';
  }

  if (isAuthError(error)) {
    return 'Authentication required. Please log in and try again.';
  }

  return getErrorMessage(error);
};
