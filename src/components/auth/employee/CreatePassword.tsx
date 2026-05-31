import React, { useState } from 'react';
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

const EmployeeCreatePasswordPage: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/employee/dashboard');
  };

  return (
    <AuthSplitPage>
      <AuthHeader
        title="Create password"
        subtitle="Choose a secure password for your account."
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-2"
            style={{ color: authTokens.titleColor }}
          >
            New Password
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
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-gray-700"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          <p className="mt-2 text-xs" style={{ color: authTokens.bodyColor }}>
            Password must be 8 letters long and should contain special
            characters &amp; numbers (e.g @#23)
          </p>
        </div>

        <AuthPrimaryButton>Continue</AuthPrimaryButton>
      </form>

      <AuthBackLink to="/employee/forgot-password/otp" label="Back" />
    </AuthSplitPage>
  );
};

export default EmployeeCreatePasswordPage;
