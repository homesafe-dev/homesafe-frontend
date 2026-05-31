import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';
import authApi from '../../../api/authApi';
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

const SigninPasswordPage: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
  const { login, completeTfaLogin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from session storage
    const storedEmail = sessionStorage.getItem('signinEmail');
    if (!storedEmail) {
      // Redirect back to login page if email is not found
      navigate('/login');
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.trim() === '') {
      setErrorMessage('Please enter your password');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Use 'employer' as default type, but the actual role will come from the response
      const response = await login(email, password, 'employer');

      if (response.success && response.data) {
        if (response.data.requires_tfa) {
          setPendingTfaToken(response.data.tfa_token || null);
          setPendingTfaEmail(response.data.email || email);
          setPendingTfaMethod(
            response.data.tfa_method === 'authenticator'
              ? 'authenticator'
              : 'email'
          );
          setErrorMessage(null);
          return;
        }

        if (response.data.requires_password_change) {
          sessionStorage.setItem('firstTimeLoginEmail', email);
          sessionStorage.setItem(
            'firstTimeLoginToken',
            response.data.token || ''
          );
          sessionStorage.setItem('firstTimeLoginPassword', password);
          navigate('/signin/create-password');
          return;
        }

        if (response.data.requires_profile_completion) {
          sessionStorage.setItem('signupEmail', response.data.email || email);
          navigate('/signup/password');
          return;
        }

        // Check if there's a redirect URL stored from a previous protected route access
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');

        // Determine which dashboard to navigate to based on user role
        const userRole = response.data.role;

        if (redirectUrl) {
          // Clear the stored redirect URL
          sessionStorage.removeItem('redirectAfterLogin');

          // Check if the redirect URL is appropriate for the user's role
          const rolePrefix = `/${userRole}`;
          if (redirectUrl.startsWith(rolePrefix)) {
            // Only redirect if the URL matches the user's role
            navigate(redirectUrl);
            return;
          }
        }

        // If no valid redirect URL, go to the appropriate dashboard
        if (userRole === 'employer') {
          navigate('/employer/dashboard');
        } else if (userRole === 'employee') {
          navigate('/employee/dashboard');
        } else if (userRole === 'agent') {
          navigate('/agent/dashboard');
        } else {
          // Default fallback if role is not recognized
          console.warn('Unknown user role:', userRole);
          navigate('/employer/dashboard');
        }
      } else {
        if (response.data?.requires_password_change) {
          sessionStorage.setItem('firstTimeLoginEmail', email);
          sessionStorage.setItem(
            'firstTimeLoginToken',
            response.data.token || ''
          );
          sessionStorage.setItem('firstTimeLoginPassword', password);
          navigate('/signin/create-password');
          return;
        }
        if (response.data?.requires_profile_completion) {
          sessionStorage.setItem('signupEmail', response.data.email || email);
          navigate('/signup/password');
          return;
        }
        setErrorMessage(response.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('An error occurred during login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleBackToEmail = () => {
    navigate('/login');
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
    <AuthSplitPage footer={!pendingTfaToken ? <AuthSocialFooter /> : undefined}>
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
              {pendingTfaMethod === 'email' ? (
                <button
                  type="button"
                  className="text-sm font-semibold hover:underline disabled:opacity-50"
                  style={{ color: authTokens.primaryDark }}
                  onClick={handleResendTfaCode}
                  disabled={isResendingTfa}
                >
                  {isResendingTfa ? 'Resending...' : 'Resend code'}
                </button>
              ) : (
                <span
                  className="text-xs"
                  style={{ color: authTokens.bodyColor }}
                >
                  Open your authenticator app for a new code.
                </span>
              )}

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
            </div>
          </form>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={handleBackToEmail}
            className="mb-4 text-sm font-medium hover:underline self-start"
            style={{ color: authTokens.bodyColor }}
            aria-label="Back to email"
          >
            &larr; Back
          </button>

          <AuthHeader
            title="Sign in"
            subtitle={email ? `Signing in as ${email}` : undefined}
          />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: authTokens.titleColor }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter password"
                  className={`${authPillInputClass} pl-4 pr-12`}
                  style={authPillInputBorderStyle}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
              </div>
              {errorMessage && (
                <p className="mt-2 text-sm text-red-600 text-center">
                  {errorMessage}
                </p>
              )}
            </div>

            <AuthPrimaryButton
              loading={isSubmitting || loading}
              loadingLabel="Signing in..."
            >
              Continue
            </AuthPrimaryButton>

            <p className="text-right">
              <Link
                to="/signin/forgot-password"
                className="text-xs font-medium hover:underline"
                style={{ color: authTokens.titleColor }}
              >
                Forgot Password?
              </Link>
            </p>
          </form>
        </>
      )}
    </AuthSplitPage>
  );
};

export default SigninPasswordPage;
