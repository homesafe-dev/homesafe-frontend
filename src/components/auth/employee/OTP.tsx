import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

const EmployeeForgotPasswordOTPPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.toUpperCase();
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
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
    const pastedData = e.clipboardData.getData('text').trim();
    const cleanedData = pastedData.replace(/[^a-zA-Z0-9]/g, '');

    if (!cleanedData) return;

    if (cleanedData.length === 6) {
      setOtp(cleanedData.split(''));
      inputRefs.current[5]?.focus();
    } else if (cleanedData.length > 0) {
      const currentIndex = otp.findIndex((val) => val === '');
      const availableSlots = 6 - currentIndex;
      const dataToUse = cleanedData.slice(0, availableSlots);
      const newOtp = [...otp];
      for (let i = 0; i < dataToUse.length; i++) {
        newOtp[currentIndex + i] = dataToUse[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(currentIndex + dataToUse.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/employee/create-password');
  };

  const handleResetCode = () => {
    // Resend hook when API is wired
  };

  return (
    <AuthSplitPage>
      <AuthHeader
        title="OTP"
        subtitle="Enter the OTP code sent to your email address. You can paste the entire code at once."
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-between gap-2 md:gap-3 relative">
          <input
            type="text"
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
            onPaste={handlePaste}
            aria-hidden
            tabIndex={-1}
          />
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="text"
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
              autoComplete="one-time-code"
            />
          ))}
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={handleResetCode}
            className="text-sm font-semibold hover:underline"
            style={{ color: authTokens.primaryDark }}
          >
            Resend code
          </button>
        </div>

        <AuthPrimaryButton>Continue</AuthPrimaryButton>
      </form>

      <AuthBackLink to="/employee/forgot-password" label="Back" />
    </AuthSplitPage>
  );
};

export default EmployeeForgotPasswordOTPPage;
