import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { markOtpSent, OTP_STORAGE_KEYS } from '../../../utils/otpInput';
import { readOAuthErrorFromSearch } from '../../../utils/googleAuth';
import { getRecaptchaToken } from '../../../utils/recaptcha';
import {
  AuthSplitPage,
  AuthHeader,
  AuthPrimaryButton,
  AuthSocialFooter,
} from '../shared/AuthLayout';
import {
  authPillInputClass,
  authPillInputBorderStyle,
} from '../shared/authStyles.ts';
import { authTokens } from '../shared/authTokens.ts';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { sendOTP, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const oauthError = readOAuthErrorFromSearch(searchParams.toString());
    if (oauthError) {
      setErrorMessage(oauthError);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const recaptchaToken = await getRecaptchaToken('signup');
      const response = await sendOTP(email, recaptchaToken);

      if (response.success) {
        sessionStorage.setItem('signupEmail', email);
        markOtpSent(OTP_STORAGE_KEYS.signupSentAt);
        if (response.data?.resume_registration) {
          sessionStorage.setItem(
            'signupResumeMessage',
            response.message ||
              'Welcome back. Enter the code we sent to finish setting up your account.'
          );
        } else {
          sessionStorage.removeItem('signupResumeMessage');
        }
        navigate('/signup/otp');
      } else {
        setErrorMessage(response.message);
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      setErrorMessage(
        err instanceof Error && err.message.includes('reCAPTCHA')
          ? 'Unable to verify you are human. Please refresh and try again.'
          : 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthSplitPage
      footer={
        <p
          className="mt-8 text-[12px] text-center leading-relaxed px-2"
          style={{ color: authTokens.bodyColor }}
        >
          By continuing you agree to HomeSafe Terms &amp; Conditions.
        </p>
      }
    >
      <AuthHeader
        title="Create account"
        subtitle="Enter your email to get started."
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
            disabled={isSubmitting}
            autoComplete="email"
          />
        </div>

        {errorMessage && (
          <p className="text-sm text-red-600 text-center">{errorMessage}</p>
        )}

        <AuthPrimaryButton
          loading={isSubmitting || loading}
          loadingLabel="Sending OTP..."
        >
          Continue
        </AuthPrimaryButton>
      </form>

      <p
        className="mt-5 text-center text-sm"
        style={{ color: authTokens.bodyColor }}
      >
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold hover:underline"
          style={{ color: authTokens.primaryDark }}
        >
          Sign in here
        </Link>
      </p>

      <AuthSocialFooter googleFlow="signup" />
    </AuthSplitPage>
  );
};

export default SignupPage;
