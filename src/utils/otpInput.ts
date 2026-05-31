export const OTP_LENGTH = 6;
export const OTP_EXPIRY_SECONDS = 10 * 60;

export const OTP_STORAGE_KEYS = {
  signupSentAt: 'signupOtpSentAt',
  resetSentAt: 'resetOtpSentAt',
} as const;

export const markOtpSent = (storageKey: string): number => {
  const sentAt = Date.now();
  sessionStorage.setItem(storageKey, String(sentAt));
  return sentAt;
};

export const getOtpSentAt = (storageKey: string): number | null => {
  const stored = sessionStorage.getItem(storageKey);
  if (!stored) return null;
  const parsed = Number(stored);
  return Number.isNaN(parsed) ? null : parsed;
};

export const getOtpSecondsRemaining = (sentAt: number): number => {
  const elapsed = Math.floor((Date.now() - sentAt) / 1000);
  return Math.max(0, OTP_EXPIRY_SECONDS - elapsed);
};

export const formatOtpCountdown = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/** Keep a single numeric digit (0-9). */
export const sanitizeOtpDigit = (value: string): string =>
  value.replace(/\D/g, '').slice(-1);

/** Parse pasted text into exactly `length` numeric digits. */
export const sanitizeOtpPaste = (
  text: string,
  length: number = OTP_LENGTH
): string[] => {
  const digits = text.replace(/\D/g, '').slice(0, length).split('');
  return Array.from({ length }, (_, i) => digits[i] ?? '');
};
