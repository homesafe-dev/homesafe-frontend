import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import authApi from '../../../api/authApi';
import { useAuth } from '../../../contexts/AuthContext';
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
import { readOAuthErrorFromSearch } from '../../../utils/googleAuth';
import { getRecaptchaToken } from '../../../utils/recaptcha';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REMEMBER_EMAIL_KEY = 'homesafe_remember_email';
const REMEMBER_ME_KEY = 'homesafe_remember_me';

const HomesafeSignupPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [tfaCode, setTfaCode] = useState<string>('');
  const [pendingTfaToken, setPendingTfaToken] = useState<string | null>(null);
  const [pendingTfaEmail, setPendingTfaEmail] = useState<string>('');
  const [pendingTfaMethod, setPendingTfaMethod] = useState<
    'email' | 'authenticator'
  >('email');
  const [isVerifyingTfa, setIsVerifyingTfa] = useState<boolean>(false);
  const [isResendingTfa, setIsResendingTfa] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { login, completeTfaLogin, loading } = useAuth();

  useEffect(() => {
    const oauthError = readOAuthErrorFromSearch(searchParams.toString());
    if (oauthError) {
      setErrorMessage(oauthError);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const remembered = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    setRememberMe(remembered);
    if (remembered) {
      const storedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmed = email.trim();
    if (trimmed === '') {
      setErrorMessage('Please enter your email address');
      return;
    }

    if (!emailPattern.test(trimmed)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (password.trim() === '') {
      setErrorMessage('Please enter your password');
      return;
    }

    setIsSubmitting(true);

    try {
      if (rememberMe) {
        localStorage.setItem(REMEMBER_ME_KEY, 'true');
        localStorage.setItem(REMEMBER_EMAIL_KEY, trimmed);
      } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
      }

      const recaptchaToken = await getRecaptchaToken('login');

      // Use 'employer' as default type, but the role will come from the response
      const response = await login(
        trimmed,
        password,
        'employer',
        recaptchaToken
      );

      if (response.success && response.data) {
        if (response.data.requires_tfa) {
          setPendingTfaToken(response.data.tfa_token || null);
          setPendingTfaEmail(response.data.email || trimmed);
          setPendingTfaMethod(
            response.data.tfa_method === 'authenticator'
              ? 'authenticator'
              : 'email'
          );
          setErrorMessage(null);
          return;
        }

        if (response.data.requires_password_change) {
          sessionStorage.setItem('firstTimeLoginEmail', trimmed);
          sessionStorage.setItem(
            'firstTimeLoginToken',
            response.data.token || ''
          );
          sessionStorage.setItem('firstTimeLoginPassword', password);
          navigate('/signin/create-password');
          return;
        }

        if (response.data.requires_profile_completion) {
          sessionStorage.setItem('signupEmail', response.data.email || trimmed);
          sessionStorage.setItem(
            'signupResumeMessage',
            response.message ||
              'Finish setting up your account. Choose a password to continue.'
          );
          navigate('/signup/password');
          return;
        }

        // Check if there's a redirect URL stored from a previous protected route access
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
        const userRole = response.data.role;

        if (redirectUrl) {
          sessionStorage.removeItem('redirectAfterLogin');
          const rolePrefix = `/${userRole}`;
          if (redirectUrl.startsWith(rolePrefix)) {
            navigate(redirectUrl);
            return;
          }
        }

        if (userRole === 'employer') {
          navigate('/employer/dashboard');
        } else if (userRole === 'employee') {
          navigate('/employee/dashboard');
        } else if (userRole === 'agent') {
          navigate('/agent/dashboard');
        } else if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/employer/dashboard');
        }
      } else {
        if (response.data?.requires_password_change) {
          sessionStorage.setItem('firstTimeLoginEmail', trimmed);
          sessionStorage.setItem(
            'firstTimeLoginToken',
            response.data.token || ''
          );
          sessionStorage.setItem('firstTimeLoginPassword', password);
          navigate('/signin/create-password');
          return;
        }
        if (response.data?.requires_profile_completion) {
          sessionStorage.setItem('signupEmail', response.data.email || trimmed);
          sessionStorage.setItem(
            'signupResumeMessage',
            response.message ||
              'Finish setting up your account. Choose a password to continue.'
          );
          navigate('/signup/password');
          return;
        }
        setErrorMessage(response.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      const message =
        err instanceof Error && err.message.includes('reCAPTCHA')
          ? 'Unable to verify you are human. Please refresh and try again.'
          : 'An error occurred during login. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyTfa = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pendingTfaToken || !pendingTfaEmail) {
      setErrorMessage('TFA session expired. Please login again.');
      return;
    }

    if (!tfaCode.trim()) {
      setErrorMessage(
        pendingTfaMethod === 'email'
          ? 'Please enter the verification code sent to your email.'
          : 'Please enter the code from your authenticator app.'
      );
      return;
    }

    setIsVerifyingTfa(true);
    setErrorMessage(null);

    try {
      const result = await completeTfaLogin(
        pendingTfaEmail,
        pendingTfaToken,
        tfaCode.trim(),
        'employer'
      );

      if (!result.success || !result.data) {
        setErrorMessage(result.message || 'Invalid verification code');
        return;
      }

      const userRole = result.data.role;
      if (userRole === 'employer') {
        navigate('/employer/dashboard');
      } else if (userRole === 'employee') {
        navigate('/employee/dashboard');
      } else if (userRole === 'agent') {
        navigate('/agent/dashboard');
      } else if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employer/dashboard');
      }
    } catch {
      setErrorMessage('Unable to verify code. Please try again.');
    } finally {
      setIsVerifyingTfa(false);
    }
  };

  const handleResendTfaCode = async () => {
    if (!pendingTfaToken || !pendingTfaEmail) {
      setErrorMessage('TFA session expired. Please login again.');
      return;
    }

    setIsResendingTfa(true);
    setErrorMessage(null);

    try {
      const response = await authApi.resendTfaLoginCode(
        pendingTfaEmail,
        pendingTfaToken
      );
      if (!response.status) {
        setErrorMessage(
          response.message || 'Failed to resend verification code.'
        );
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to resend verification code.'
      );
    } finally {
      setIsResendingTfa(false);
    }
  };

  return (
    <AuthSplitPage>
      {pendingTfaToken ? (
        <>
          <AuthHeader
            title="Verify login"
            subtitle={
              pendingTfaMethod === 'email'
                ? `We sent a verification code to ${pendingTfaEmail}.`
                : 'Enter the 6-digit code from your authenticator app.'
            }
          />
          <form onSubmit={handleVerifyTfa} className="space-y-4">
            <div>
              <label
                htmlFor="tfaCode"
                className="block text-sm font-medium mb-2"
                style={{ color: authTokens.titleColor }}
              >
                Verification Code
              </label>
              <input
                type="text"
                id="tfaCode"
                placeholder="Enter 6-digit code"
                className={`${authPillInputClass} pl-4`}
                style={authPillInputBorderStyle}
                value={tfaCode}
                onChange={(e) => setTfaCode(e.target.value)}
                required
              />
              {errorMessage && (
                <p className="mt-2 text-sm text-red-600 text-center">
                  {errorMessage}
                </p>
              )}
            </div>

            <AuthPrimaryButton
              loading={isVerifyingTfa || loading}
              loadingLabel="Verifying..."
            >
              Verify
            </AuthPrimaryButton>

            <div className="flex justify-between pt-1">
              <button
                type="button"
                className="text-sm hover:underline"
                style={{ color: authTokens.bodyColor }}
                onClick={() => {
                  setPendingTfaToken(null);
                  setPendingTfaEmail('');
                  setPendingTfaMethod('email');
                  setTfaCode('');
                  setErrorMessage(null);
                }}
              >
                Back
              </button>

              <button
                type="button"
                className="text-sm font-semibold hover:underline disabled:opacity-50"
                style={{ color: authTokens.primaryDark }}
                onClick={handleResendTfaCode}
                disabled={isResendingTfa}
              >
                {isResendingTfa ? 'Resending...' : 'Resend code'}
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <AuthHeader
            title="Login"
            subtitle="Sign in to continue to your account."
          />

          <form onSubmit={handleSubmit} className="space-y-3">
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
                placeholder="Email"
                className={authPillInputClass}
                style={authPillInputBorderStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>

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
                    d="M7 10V8.5C7 5.46243 9.46243 3 12.5 3C15.5376 3 18 5.46243 18 8.5V10"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6.5 10H18.5C19.3284 10 20 10.6716 20 11.5V19C20 19.8284 19.3284 20.5 18.5 20.5H6.5C5.67157 20.5 5 19.8284 5 19V11.5C5 10.6716 5.67157 10 6.5 10Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Password"
                className={`${authPillInputClass} pr-12`}
                style={authPillInputBorderStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label
                className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer"
                style={{ color: authTokens.titleColor }}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded accent-[#174B35]"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <Link
                to="/signin/forgot-password"
                className="text-xs font-semibold hover:underline"
                style={{ color: authTokens.primaryDark }}
              >
                Forgot password?
              </Link>
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600 text-center">{errorMessage}</p>
            )}

            <AuthPrimaryButton
              loading={isSubmitting || loading}
              loadingLabel="Signing in..."
            >
              Login
            </AuthPrimaryButton>

            <p
              className="pt-1 text-center text-sm"
              style={{ color: authTokens.bodyColor }}
            >
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold hover:underline"
                style={{ color: authTokens.primaryDark }}
              >
                Sign up here
              </Link>
            </p>
          </form>

          <AuthSocialFooter />
        </>
      )}
    </AuthSplitPage>
  );
};

export default HomesafeSignupPage;
