import React, { useState, useEffect } from 'react';
import signupImg1 from '../../../assets/images/signupImg1.png';
import signupImg2 from '../../../assets/images/signupImg2.png';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import HomesafeLogo from '../../../assets/images/HomesafeLogo.png';
import HomesafeLogo2 from '../../../assets/images/HomesafeLogo2.svg';
import { useAuth } from '../../../contexts/AuthContext';

const SigninPasswordPage: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { login, loading } = useAuth();
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
        setErrorMessage(response.message || 'Invalid email or password');
      }
    } catch (error) {
      setErrorMessage('An error occurred during login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            <div className="text-center mb-6 flex flex-row items-center justify-center space-x-2">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                Sign in on
              </h1>
              <Link to="/">
                <img
                  src={HomesafeLogo2}
                  className="w-[120px] md:w-[178px] max-h-[30px]"
                  alt="Homesafe Logo"
                />
              </Link>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
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
                {errorMessage && (
                  <p className="mt-2 text-xs text-red-500">
                    {errorMessage}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className={`w-full bg-green-300 text-black py-2 px-4 rounded-md hover:bg-green-400 transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting || loading ? 'Signing in...' : 'Continue'}
              </button>
            </form>
            <p className="text-right mt-4 md:mt-[1rem]">
              <Link to="/signin/forgot-password" className="text-[#24292E] text-[13px] font-medium hover:text-green-600">
                Forgot Password?
              </Link>
            </p>

            <div className="my-4 text-center">
              <span className="text-sm text-gray-500">Or</span>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg
                className="h-4 w-4 mr-2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
          </div>

          {/* <div className="w-[416px] text-[13px] text-[#24292E] text-center mt-[3rem]">
            By clicking "Continue" you have read and understand the Terms & Conditions of Homesafe and agreed to it.
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SigninPasswordPage;
