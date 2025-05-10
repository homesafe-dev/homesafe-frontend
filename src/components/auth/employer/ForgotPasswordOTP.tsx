import React, { useState, useRef, useEffect } from 'react';
import signupImg1 from '../../../assets/images/signupImg1.png';
import signupImg2 from '../../../assets/images/signupImg2.png';
import { Link, useNavigate } from 'react-router-dom';
import HomesafeLogo from '../../../assets/images/HomesafeLogo.png';
import authApi from '../../../api/authApi';

const ForgotPasswordOTPPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from session storage
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (!storedEmail) {
      // Redirect to forgot password page if email is not found
      navigate('/employer/forgot-password');
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    // Allow both numbers and alphabets for OTP
    const value = element.value.toUpperCase(); // Convert to uppercase for consistency

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

  // Handle paste event for OTP
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().toUpperCase();

    // Remove any non-alphanumeric characters
    const cleanedData = pastedData.replace(/[^a-zA-Z0-9]/g, '');

    if (!cleanedData) {
      return;
    }

    // If pasted data matches expected length, fill all inputs
    if (cleanedData.length === 6) {
      const otpArray = cleanedData.split('');
      setOtp(otpArray);

      // Focus on the last input after paste
      inputRefs.current[5]?.focus();
    }
    // If pasted data is shorter, fill as many inputs as possible
    else if (cleanedData.length > 0) {
      const currentIndex = otp.findIndex(val => val === '');
      const availableSlots = 6 - currentIndex;
      const dataToUse = cleanedData.slice(0, availableSlots);

      const newOtp = [...otp];
      for (let i = 0; i < dataToUse.length; i++) {
        newOtp[currentIndex + i] = dataToUse[i];
      }

      setOtp(newOtp);

      // Focus on the next empty input or the last one
      const nextIndex = Math.min(currentIndex + dataToUse.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authApi.verifyForgotPasswordOTP(email, otpString);

      if (response.status) {
        // Navigate to reset password page
        navigate('/employer/reset-password');
      } else {
        setError(response.message || 'Invalid OTP. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetCode = async () => {
    setResending(true);
    setError(null);

    try {
      const response = await authApi.forgotPassword(email);

      if (response.status) {
        // Clear OTP fields
        setOtp(new Array(6).fill(''));
        // Focus on first input
        inputRefs.current[0]?.focus();
      } else {
        setError(response.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden md:flex md:w-1/2 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2">
          <div className="relative w-full h-full">
            <img
              src={signupImg1}
              alt="Top signup image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#1D2125D9]" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-1/2">
          <div className="relative w-full h-full">
            <img
              src={signupImg2}
              alt="Bottom signup image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#1D2125D9]" />
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          {/* Logo */}
          <div className="mb-8">
            <Link to="/">
              <img src={HomesafeLogo} alt="Homesafe Logo" className="" />
            </Link>
          </div>

          <div className="max-w-md">
            <p className="text-center text-[#F4F4F4] text-[24px] font-normal">
              "Our Mission at Homesafe is to make hiring safe, simple, and
              efficient for every Living Space, and to create a job search space
              for Artisans to apply through".
            </p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-6 md:p-6">
        <div className="flex flex-col items-center w-full max-w-[545px] space-y-4">
          <div className="w-full bg-white rounded-lg shadow-lg p-4 md:p-8">
            <h1 className="text-2xl md:text-[36px] text-[#24292E] font-semibold">
              OTP
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <p className="block text-sm font-medium text-gray-700 mb-2 text-center">
                  Enter the OTP code sent to your email address
                </p>
                <p className="text-xs text-gray-500 mb-4 text-center">
                  You can paste the entire code at once
                </p>
                <div className="flex justify-between gap-2 md:gap-4 mb-4 relative">
                  {/* Hidden input to capture paste events */}
                  <input
                    type="text"
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    onPaste={handlePaste}
                    aria-hidden="true"
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
                      className="w-8 h-8 md:w-12 md:h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-base md:text-lg font-semibold uppercase relative z-10"
                      disabled={loading}
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleResetCode}
                    className="text-green-500 text-sm hover:text-green-600 disabled:text-gray-400"
                    disabled={resending}
                  >
                    {resending ? 'Resending...' : 'Reset code'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 text-red-500 text-sm">{error}</div>
              )}

              <button
                type="submit"
                className="w-full bg-green-300 text-black py-2 px-4 rounded-md hover:bg-green-400 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Continue'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <Link to="/login" className="text-green-600 hover:text-green-800">
                Back to Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordOTPPage;
