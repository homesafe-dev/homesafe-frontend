import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
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
import { authTokens } from '../shared/authTokens.ts';

const SignupPasswordPage: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('signupEmail');
    if (!storedEmail) {
      navigate('/signup');
      return;
    }

    const resumeMsg = sessionStorage.getItem('signupResumeMessage');
    if (resumeMsg) {
      setInfoMessage(resumeMsg);
      sessionStorage.removeItem('signupResumeMessage');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    if (!hasSpecialChar || !hasNumber) {
      setErrorMessage(
        'Password must contain at least one special character and one number'
      );
      return;
    }
    sessionStorage.setItem('signupPassword', password);
    navigate('/signup/onboarding-form');
  };

  return (
    <AuthSplitPage>
      <AuthHeader
        title="Set password"
        subtitle="Choose a strong password for your account."
      />

      {infoMessage && (
        <p
          className="mb-4 text-sm text-center leading-relaxed px-2"
          style={{ color: authTokens.primaryDark }}
        >
          {infoMessage}
        </p>
      )}

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
            autoComplete="new-password"
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

        <p className="text-xs px-1" style={{ color: authTokens.bodyColor }}>
          At least 8 characters with letters, numbers and symbols (e.g. @#23).
        </p>

        {errorMessage && (
          <p className="text-sm text-red-600 text-center">{errorMessage}</p>
        )}

        <AuthPrimaryButton>Continue</AuthPrimaryButton>
      </form>

      <AuthBackLink to="/signup" label="Back to sign up" />
    </AuthSplitPage>
  );
};

export default SignupPasswordPage;
