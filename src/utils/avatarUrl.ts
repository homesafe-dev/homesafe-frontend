export function hasUsableAvatarUrl(avatar: string | null | undefined): boolean {
  if (avatar == null || typeof avatar !== 'string') return false;
  const t = avatar.trim();
  if (!t) return false;
  const lower = t.toLowerCase();
  if (lower === 'null' || lower === 'undefined') return false;
  return true;
}
