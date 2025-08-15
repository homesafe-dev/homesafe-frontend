export const getBackendBaseUrl = (): string => {
  // Check for environment variable first
  if (import.meta.env.VITE_BACKEND_BASE_URL) {
    return import.meta.env.VITE_BACKEND_BASE_URL;
  }

  return 'https://homesafeng.xyz/api';
  // return 'http://127.0.0.1:8000/api';
};
