export const getBackendBaseUrl = (): string => {
  // Check for environment variable first
  if (import.meta.env.VITE_BACKEND_BASE_URL) {
    return import.meta.env.VITE_BACKEND_BASE_URL;
  }

  // Check if running locally
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    return 'https://d80b3a15bf4e.ngrok-free.app/api';
  }

  // Default production URL
  return 'https://homesafeng.xyz/api';
};
