import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../../api/authApi';
import { useOtpCountdown } from '../../../hooks/useOtpCountdown';
import { getRecaptchaToken } from '../../../utils/recaptcha';
import {
  OTP_LENGTH,
  OTP_STORAGE_KEYS,
  sanitizeOtpDigit,
  sanitizeOtpPaste,
} from '../../../utils/otpInput';
import {
  AuthSplitPage,
  AuthHeader,
  AuthPrimaryButton,
  AuthBackLink,
} from '../shared/AuthLayout';
import {
  authOtpInputClass,
  authPillInputBorderStyle,
} from '../shared/authStyles.ts';
import { authTokens } from '../shared/authTokens.ts';

const ForgotPasswordOTPPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { formattedCountdown, isExpired, resetCountdown, expiryMinutes } =
    useOtpCountdown(OTP_STORAGE_KEYS.resetSentAt);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (!storedEmail) {
      navigate('/signin/forgot-password');
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = sanitizeOtpDigit(element.value);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = sanitizeOtpPaste(e.clipboardData.getData('text'));
    if (!pasted.some((d) => d !== '')) return;
    setOtp(pasted);
    const lastFilled = pasted.reduce(
      (idx: number, d: string, i: number) => (d !== '' ? i : idx),
      0
    );
    inputRefs.current[Math.min(lastFilled + 1, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isExpired) {
      setError('This code has expired. Please request a new one to continue.');
      return;
    }
    const otpString = otp.join('');
    if (otpString.length !== OTP_LENGTH) {
      setError('Please enter the full 6-digit code');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.verifyForgotPasswordOTP(email, otpString);
      if (response.status) {
        sessionStorage.setItem('resetToken', response.data?.reset_token ?? '');
        navigate('/reset-password');
      } else {
        setError(response.message || 'Invalid OTP. Please try again.');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(
        axiosErr.response?.data?.message ||
          'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetCode = async () => {
    setResending(true);
    setError(null);
    try {
      const recaptchaToken = await getRecaptchaToken('forgot_password');
      const response = await authApi.forgotPassword(email, recaptchaToken);
      if (response.status) {
        setOtp(new Array(OTP_LENGTH).fill(''));
        resetCountdown();
        inputRefs.current[0]?.focus();
      } else {
        setError(response.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('reCAPTCHA')) {
        setError(
          'Unable to verify you are human. Please refresh and try again.'
        );
      } else {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(
          axiosErr.response?.data?.message ||
            'An error occurred. Please try again.'
        );
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthSplitPage>
      <AuthHeader
        title="Verify email"
        subtitle={`Enter the 6-digit code sent to ${email || 'your email'}.`}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <p
          className="text-center text-xs"
          style={{ color: authTokens.bodyColor }}
        >
          Numbers only. Expires in {expiryMinutes} minutes.
        </p>
        <p
          className={`text-center text-xs font-medium ${
            isExpired ? 'text-red-600' : ''
          }`}
          style={isExpired ? undefined : { color: authTokens.bodyColor }}
          aria-live="polite"
        >
          {isExpired
            ? 'Code expired — request a new one below'
            : `Time remaining: ${formattedCountdown}`}
        </p>

        <div className="flex justify-between gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className={authOtpInputClass}
              style={authPillInputBorderStyle}
              disabled={loading || isExpired}
              autoComplete="one-time-code"
            />
          ))}
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={handleResetCode}
            className="text-sm font-semibold hover:underline disabled:opacity-50"
            style={{ color: authTokens.primaryDark }}
            disabled={resending}
          >
            {resending ? 'Resending...' : 'Resend code'}
          </button>
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <AuthPrimaryButton
          loading={loading}
          loadingLabel="Verifying..."
          disabled={isExpired}
        >
          Continue
        </AuthPrimaryButton>
      </form>

      <AuthBackLink to="/login" />
    </AuthSplitPage>
  );
};

export default ForgotPasswordOTPPage;
