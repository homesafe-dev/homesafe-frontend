import React, { useState } from 'react';
import signupImg1 from '../../../assets/images/signupImg1.png';
import signupImg2 from '../../../assets/images/signupImg2.png';
import { Link, useNavigate } from 'react-router-dom';
import HomesafeLogo from '../../../assets/images/HomesafeLogo.png';
import authApi from '../../../api/authApi';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.forgotPassword(email);

      if (response.status) {
        // Store email in sessionStorage for use in OTP verification
        sessionStorage.setItem('resetEmail', email);
        navigate('/employer/forgot-password/otp');
      } else {
        setError(response.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
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
              Forgot Password
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="mb-4 mt-4 md:mt-[1rem]">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="mb-4 text-red-500 text-sm">{error}</div>
              )}

              <button
                type="submit"
                className="w-full bg-green-300 text-black py-2 px-4 rounded-md hover:bg-green-400 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Continue'}
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

export default ForgotPassword;
