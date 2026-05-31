import { useCallback, useEffect, useState } from 'react';
import {
  formatOtpCountdown,
  getOtpSecondsRemaining,
  getOtpSentAt,
  markOtpSent,
  OTP_EXPIRY_SECONDS,
} from '../utils/otpInput';

export const useOtpCountdown = (storageKey: string) => {
  const [sentAt, setSentAt] = useState<number>(() => {
    const existing = getOtpSentAt(storageKey);
    return existing ?? markOtpSent(storageKey);
  });
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (getOtpSecondsRemaining(sentAt) <= 0) return;

    const intervalId = window.setInterval(() => {
      forceUpdate((n) => n + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [sentAt]);

  const secondsRemaining = getOtpSecondsRemaining(sentAt);
  const isExpired = secondsRemaining <= 0;

  const resetCountdown = useCallback(() => {
    const now = markOtpSent(storageKey);
    setSentAt(now);
    forceUpdate((n) => n + 1);
  }, [storageKey]);

  return {
    secondsRemaining,
    formattedCountdown: formatOtpCountdown(secondsRemaining),
    isExpired,
    resetCountdown,
    expiryMinutes: OTP_EXPIRY_SECONDS / 60,
  };
};
