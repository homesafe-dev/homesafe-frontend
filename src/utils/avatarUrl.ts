import { getBackendBaseUrl } from './config';

export function hasUsableAvatarUrl(avatar: string | null | undefined): boolean {
  if (avatar == null || typeof avatar !== 'string') return false;
  const t = avatar.trim();
  if (!t) return false;
  const lower = t.toLowerCase();
  if (lower === 'null' || lower === 'undefined') return false;
  if (
    t === 'https://via.placeholder.com/150' ||
    t === 'https://via.placeholder.com/100' ||
    lower.includes('placeholder')
  ) {
    return false;
  }
  return true;
}

/** Laravel app origin without the `/api` suffix (storage lives on the app host). */
export function getBackendAppUrl(): string {
  return getBackendBaseUrl().replace(/\/api\/?$/, '');
}

/** Turns storage paths or relative URLs into a full network URL. */
export function resolveMediaUrl(
  path: string | null | undefined
): string | null {
  if (!hasUsableAvatarUrl(path)) return null;

  const trimmed = path!.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  const base = getBackendAppUrl();
  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${base}${normalized}`;
}
