import React, { useState, useRef } from 'react';
import signupImg1 from '../../../assets/images/signupimg1.png';
import signupImg2 from '../../../assets/images/signupimg2.png';
import { Link } from 'react-router-dom';
import HomesafeLogo from '../../../assets/images/HomesafeLogo.png';

const ForgotPasswordOTPPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    console.log('OTP submitted:', otpString);
  };

  const handleResetCode = () => {
    console.log('Resetting code...');
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
          <div className="mb-8">
            <img src={HomesafeLogo} alt="Homesafe Logo" className="" />
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
                <p className="block text-sm font-medium text-gray-700 mb-4 text-center">
                  Enter the OTP code sent to your email address
                </p>
                <div className="flex justify-between gap-2 md:gap-4 mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      onChange={(e) => handleChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-8 h-8 md:w-12 md:h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-base md:text-lg font-semibold"
                    />
                  ))}
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleResetCode}
                    className="text-green-500 text-sm hover:text-green-600"
                  >
                    Reset code
                  </button>
                </div>
              </div>

              <Link to="/employee/create-password" className="block w-full">
                <button
                  type="submit"
                  className="w-full bg-green-300 text-black py-2 px-4 rounded-md hover:bg-green-400 transition-colors"
                >
                  Continue
                </button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordOTPPage;
