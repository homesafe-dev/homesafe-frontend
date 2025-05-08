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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
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
      const { status } = error.response;
      
      if (status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('auth_token');
        // You might want to redirect to login page
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
