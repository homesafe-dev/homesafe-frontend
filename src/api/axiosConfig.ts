import axios from 'axios';
import { getBackendBaseUrl } from '../utils/config';

const axiosInstance = axios.create({
  baseURL: getBackendBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, config } = error.response;

      if (status === 401) {
        // Skip auth endpoints
        if (
          config.url &&
          !config.url.includes('/login') &&
          !config.url.includes('/verify-otp') &&
          !config.url.includes('/send-otp') &&
          !config.url.includes('/complete-registration')
        ) {
          const isPageRefresh =
            document.referrer === '' ||
            document.referrer.includes(window.location.host);

          if (!isPageRefresh || config.url.includes('/profile')) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');

            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
