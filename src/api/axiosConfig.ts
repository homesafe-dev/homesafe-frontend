import axios from 'axios';

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: 'http://192.227.190.166/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Log first 10 chars of token for debugging (don't log full token for security)
    }
    return config;
  },
  (error) => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here (e.g., 401 Unauthorized, 403 Forbidden)
    if (error.response) {
      const { status, config } = error.response;

      // Only handle 401 errors for non-auth endpoints
      // This prevents automatic logout during page refresh
      if (status === 401) {
        // Skip auth endpoints
        if (
          !config.url.includes('/login') &&
          !config.url.includes('/verify-otp') &&
          !config.url.includes('/send-otp') &&
          !config.url.includes('/complete-registration')
        ) {
          // Check if this is an API call after page refresh
          const isPageRefresh =
            document.referrer === '' ||
            document.referrer.includes(window.location.host);

          // Check if we're in the refresh grace period (commented out for now)
          // const isInRefreshPeriod = sessionStorage.getItem('is_page_refresh') === 'true';

          // Only clear auth and redirect if it's not a page refresh
          // or if it's a specific API call that requires authentication
          if (!isPageRefresh || config.url.includes('/profile')) {
            // Handle unauthorized access
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');

            // Redirect to login page - we'll use window.location to force a full page reload
            // This ensures the app state is completely reset
            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
