import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../../api/authApi';
import { markOtpSent, OTP_STORAGE_KEYS } from '../../../utils/otpInput';
import {
  AuthSplitPage,
  AuthHeader,
  AuthPrimaryButton,
  AuthBackLink,
} from '../shared/AuthLayout';
import {
  authPillInputClass,
  authPillInputBorderStyle,
} from '../shared/authStyles.ts';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.forgotPassword(email);

      if (response.status) {
        sessionStorage.setItem('resetEmail', email);
        markOtpSent(OTP_STORAGE_KEYS.resetSentAt);
        navigate('/forgot-password/otp');
      } else {
        setError(response.message || 'Failed to send OTP. Please try again.');
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

  return (
    <AuthSplitPage>
      <AuthHeader
        title="Forgot password"
        subtitle="Enter your email and we will send you a verification code."
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M4 6.5C4 5.67157 4.67157 5 5.5 5H18.5C19.3284 5 20 5.67157 20 6.5V17.5C20 18.3284 19.3284 19 18.5 19H5.5C4.67157 19 4 18.3284 4 17.5V6.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M6 7.5L12 12L18 7.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <input
            type="email"
            id="email"
            placeholder="Enter email address"
            className={authPillInputClass}
            style={authPillInputBorderStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            autoComplete="email"
          />
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <AuthPrimaryButton loading={loading} loadingLabel="Sending...">
          Continue
        </AuthPrimaryButton>
      </form>

      <AuthBackLink to="/login" />
    </AuthSplitPage>
  );
};

export default ForgotPassword;
