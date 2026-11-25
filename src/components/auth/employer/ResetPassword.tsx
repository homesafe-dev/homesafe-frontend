import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import authApi from '../../../api/authApi';
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

const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [resetToken, setResetToken] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetEmail');
    const storedToken = sessionStorage.getItem('resetToken');
    if (!storedEmail || !storedToken) {
      navigate('/signin/forgot-password');
      return;
    }
    setEmail(storedEmail);
    setResetToken(storedToken);
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.resetPassword(email, resetToken, password);
      if (response.status) {
        sessionStorage.removeItem('resetEmail');
        sessionStorage.removeItem('resetToken');
        navigate('/login', {
          state: {
            message:
              'Password reset successfully. Please login with your new password.',
          },
        });
      } else {
        setError(
          response.message || 'Failed to reset password. Please try again.'
        );
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

  const passwordField = (
    id: string,
    value: string,
    onChange: (v: string) => void,
    show: boolean,
    onToggle: () => void,
    placeholder: string
  ) => (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
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
        type={show ? 'text' : 'password'}
        id={id}
        placeholder={placeholder}
        className={`${authPillInputClass} pr-12`}
        style={authPillInputBorderStyle}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={loading}
        autoComplete="new-password"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
      </button>
    </div>
  );

  return (
    <AuthSplitPage>
      <AuthHeader
        title="Reset password"
        subtitle="Choose a new password for your account."
      />

      <form onSubmit={handleSubmit} className="space-y-3">
        {passwordField(
          'password',
          password,
          setPassword,
          showPassword,
          () => setShowPassword(!showPassword),
          'New password'
        )}
        {passwordField(
          'confirmPassword',
          confirmPassword,
          setConfirmPassword,
          showConfirmPassword,
          () => setShowConfirmPassword(!showConfirmPassword),
          'Confirm password'
        )}
        <p className="text-xs px-1" style={{ color: authTokens.bodyColor }}>
          At least 8 characters with letters, numbers and symbols (e.g. @#23).
        </p>
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        <AuthPrimaryButton loading={loading} loadingLabel="Resetting...">
          Reset password
        </AuthPrimaryButton>
      </form>

      <AuthBackLink to="/login" />
    </AuthSplitPage>
  );
};

export default ResetPasswordPage;
