import React, { useState, useEffect } from 'react';
import signupImg1 from '../../../assets/images/signupImg1.png';
import signupImg2 from '../../../assets/images/signupImg2.png';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import HomesafeLogo from '../../../assets/images/HomesafeLogo.png';
import authApi from '../../../api/authApi';

const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
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
      const response = await authApi.resetPassword(email, password);
      
      if (response.status) {
        // Clear session storage
        sessionStorage.removeItem('resetEmail');
        // Redirect to login page
        navigate('/login', { 
          state: { message: 'Password reset successfully. Please login with your new password.' } 
        });
      } else {
        setError(response.message || 'Failed to reset password. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
              Reset Password
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="mb-4 mt-4 md:mt-[1rem]">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="*******"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={20} />
                    ) : (
                      <FaEye size={20} />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Password must be 8 letters long and should contain special
                  characters & numbers (e.g @#23)
                </p>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    placeholder="*******"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash size={20} />
                    ) : (
                      <FaEye size={20} />
                    )}
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
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <Link to="/employer/signin" className="text-green-600 hover:text-green-800">
                Back to Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
