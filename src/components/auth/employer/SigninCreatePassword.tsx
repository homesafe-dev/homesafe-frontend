import React, { useState } from 'react';
import signupImg1 from '../../../assets/images/signupimg1.png';
import signupImg2 from '../../../assets/images/signupimg2.png';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import HomesafeLogo from '../../../assets/images/HomesafeLogo.png';

const SigninCreatePasswordPage: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password submitted:', password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex h-screen bg-gray-100">
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

      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-[545px] bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-[#24292E] font-semibold text-[36px]">
              Create Password
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="mb-4 mt-[1rem]">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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

              <Link to="/employer/dashboard">
                <button
                  type="submit"
                  className="w-full bg-green-300 text-black py-2 px-4 rounded-md hover:bg-green-400 transition-colors"
                >
                  Continue
                </button>
              </Link>
            </form>
            <p className="text-right text-[#24292E] text-[13px] font-medium mt-[1rem]">
              Forgot Password?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninCreatePasswordPage;
