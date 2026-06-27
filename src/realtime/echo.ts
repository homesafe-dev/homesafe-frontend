import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { getBackendBaseUrl } from '../utils/config';

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

window.Pusher = Pusher;

if (import.meta.env.DEV) {
  Pusher.logToConsole = true;
}

const getReverbConfig = () => {
  const scheme = import.meta.env.VITE_REVERB_SCHEME ?? 'http';
  const host = import.meta.env.VITE_REVERB_HOST ?? 'localhost';
  const port = Number(import.meta.env.VITE_REVERB_PORT ?? 8080);
  const key = import.meta.env.VITE_REVERB_APP_KEY ?? '';

  return { scheme, host, port, key };
};

export const getBroadcastAuthEndpoint = (): string => {
  const apiBase = getBackendBaseUrl().replace(/\/$/, '');

  if (apiBase.endsWith('/api')) {
    return apiBase.replace(/\/api$/, '/broadcasting/auth');
  }

  return `${apiBase}/broadcasting/auth`;
};

export const createEcho = (token: string): Echo<'reverb'> | null => {
  const { scheme, host, port, key } = getReverbConfig();

  if (!key) {
    console.warn('[Echo] VITE_REVERB_APP_KEY is not configured.');
    return null;
  }

  return new Echo({
    broadcaster: 'reverb',
    key,
    wsHost: host,
    wsPort: port,
    wssPort: port,
    forceTLS: scheme === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: getBroadcastAuthEndpoint(),
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  });
};
