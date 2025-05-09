import axios from 'axios';

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: 'http://192.227.190.166',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    console.log(`[Request] ${config.method?.toUpperCase()} ${config.url} - Token exists: ${!!token}`);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Log first 10 chars of token for debugging (don't log full token for security)
      console.log(`[Request] Using token: ${token.substring(0, 10)}...`);
    } else {
      console.log('[Request] No auth token found in localStorage');
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
    console.log(`[Response] ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    // Handle common errors here (e.g., 401 Unauthorized, 403 Forbidden)
    if (error.response) {
      const { status, config } = error.response;
      console.log(`[Response Error] ${config.method?.toUpperCase()} ${config.url} - Status: ${status}`);
      console.log('[Response Error] Full error:', error);

      // Only handle 401 errors for non-auth endpoints
      // This prevents automatic logout during page refresh
      if (status === 401) {
        console.log('[401 Error] URL:', config.url);
        console.log('[401 Error] Is auth endpoint:',
          config.url.includes('/api/login') ||
          config.url.includes('/api/verify-otp') ||
          config.url.includes('/api/send-otp') ||
          config.url.includes('/api/complete-registration')
        );

        // Skip auth endpoints
        if (!config.url.includes('/api/login') &&
            !config.url.includes('/api/verify-otp') &&
            !config.url.includes('/api/send-otp') &&
            !config.url.includes('/api/complete-registration')) {

          // Check if this is an API call after page refresh
          const isPageRefresh = document.referrer === '' ||
                               document.referrer.includes(window.location.host);

          console.log('[401 Error] Is page refresh:', isPageRefresh);
          console.log('[401 Error] Current URL:', window.location.href);
          console.log('[401 Error] Referrer:', document.referrer);

          // Check if we have a token in localStorage
          const hasToken = !!localStorage.getItem('auth_token');
          console.log('[401 Error] Has token in localStorage:', hasToken);

          // Check if we're in the refresh grace period
          const isInRefreshPeriod = sessionStorage.getItem('is_page_refresh') === 'true';
          console.log('[401 Error] Is in refresh period:', isInRefreshPeriod);

          // Only clear auth and redirect if it's not a page refresh
          // or if it's a specific API call that requires authentication
          if (!isPageRefresh || config.url.includes('/api/profile')) {
            console.log('[401 Error] Logging out user due to unauthorized access');

            // Handle unauthorized access
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');

            // Redirect to login page - we'll use window.location to force a full page reload
            // This ensures the app state is completely reset
            window.location.href = '/login';
          } else {
            console.log('[401 Error] Skipping logout because this appears to be a page refresh');
          }
        } else {
          console.log('[401 Error] Ignoring 401 for auth endpoint');
        }
      }
    } else {
      console.log('[Response Error] No response object:', error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
