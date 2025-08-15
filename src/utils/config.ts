export const getBackendBaseUrl = (): string => {
  // Check for environment variable first
  if (import.meta.env.VITE_BACKEND_BASE_URL) {
    return import.meta.env.VITE_BACKEND_BASE_URL;
  }

  return 'https://homesafeng.xyz/api';
};
