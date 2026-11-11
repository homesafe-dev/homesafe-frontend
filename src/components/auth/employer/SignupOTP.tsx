import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useOtpCountdown } from '../../../hooks/useOtpCountdown';
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
import { getRecaptchaToken } from '../../../utils/recaptcha';

const SignupOTPPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { sendOTP, verifyOTP, loading } = useAuth();
  const navigate = useNavigate();
  const { formattedCountdown, isExpired, resetCountdown, expiryMinutes } =
    useOtpCountdown(OTP_STORAGE_KEYS.signupSentAt);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('signupEmail');
    if (!storedEmail) {
      navigate('/signup');
      return;
    }
    setEmail(storedEmail);
    const resumeMsg = sessionStorage.getItem('signupResumeMessage');
    if (resumeMsg) {
      setInfoMessage(resumeMsg);
      sessionStorage.removeItem('signupResumeMessage');
    }
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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isExpired) {
      setErrorMessage(
        'This code has expired. Please request a new one to continue.'
      );
      return;
    }
    const otpString = otp.join('');
    if (otpString.length !== OTP_LENGTH) {
      setErrorMessage('Please enter the full 6-digit code');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await verifyOTP(email, otpString);
      if (response.success) {
        navigate('/signup/password');
      } else {
        setErrorMessage(response.message);
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetCode = async () => {
    setErrorMessage(null);
    try {
      const recaptchaToken = await getRecaptchaToken('signup');
      const response = await sendOTP(email, recaptchaToken);
      if (response.success) {
        setOtp(new Array(OTP_LENGTH).fill(''));
        resetCountdown();
        inputRefs.current[0]?.focus();
      } else {
        setErrorMessage(response.message);
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error && err.message.includes('reCAPTCHA')
          ? 'Unable to verify you are human. Please refresh and try again.'
          : 'Failed to resend OTP. Please try again.'
      );
    }
  };

  return (
    <AuthSplitPage>
      <AuthHeader
        title="Verify email"
        subtitle={`Enter the code we sent to ${email || 'your email'}.`}
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
              disabled={isSubmitting || isExpired}
              autoComplete="one-time-code"
            />
          ))}
        </div>

        {infoMessage && (
          <p
            className="text-sm text-center"
            style={{ color: authTokens.primaryDark }}
          >
            {infoMessage}
          </p>
        )}
        {errorMessage && (
          <p className="text-sm text-red-600 text-center">{errorMessage}</p>
        )}

        <div className="text-right">
          <button
            type="button"
            onClick={handleResetCode}
            className="text-sm font-semibold hover:underline disabled:opacity-50"
            style={{ color: authTokens.primaryDark }}
            disabled={isSubmitting || loading}
          >
            {loading ? 'Sending...' : 'Resend code'}
          </button>
        </div>

        <AuthPrimaryButton
          loading={isSubmitting}
          loadingLabel="Verifying..."
          disabled={isExpired}
        >
          Continue
        </AuthPrimaryButton>
      </form>

      <AuthBackLink to="/signup" label="Back to sign up" />
    </AuthSplitPage>
  );
};

export default SignupOTPPage;
