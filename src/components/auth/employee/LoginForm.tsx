import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const EmployeeLoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/employee/login/facial-capture');
  };

  return (
    <AuthSplitPage footer={<AuthSocialFooter />}>
      <AuthHeader
        title="Sign in"
        subtitle="Enter your email to continue with facial verification."
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
            autoComplete="email"
          />
        </div>

        <AuthPrimaryButton>Continue</AuthPrimaryButton>
      </form>
    </AuthSplitPage>
  );
};

export default EmployeeLoginForm;
