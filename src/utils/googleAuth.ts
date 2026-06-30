import { getBackendBaseUrl } from './config';

export const buildGoogleOAuthUrl = (flow: 'login' | 'signup'): string => {
  const baseUrl = getBackendBaseUrl();
  const currentOrigin = window.location.origin;
  const callbackPath = '/auth/google/callback';
  const redirectUrl = `${currentOrigin}${callbackPath}`;
  const encodedRedirect = encodeURIComponent(redirectUrl);

  return `${baseUrl}/auth/google/${flow}?redirect_url=${encodedRedirect}`;
};

export const readOAuthErrorFromSearch = (search: string): string | null => {
  const error = new URLSearchParams(search).get('error');
  if (!error?.trim()) return null;
  return error;
};

export const oauthErrorRedirectPath = (error: string): string => {
  const encoded = encodeURIComponent(error);
  const lower = error.toLowerCase();

  if (lower.includes('not found') || lower.includes('register first')) {
    return `/signup?error=${encoded}`;
  }

  return `/login?error=${encoded}`;
};
