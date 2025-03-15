import React, { useState } from 'react';
import signupImg1 from '../../../assets/images/signupimg1.png';
import signupImg2 from '../../../assets/images/signupimg2.png';
import { Link } from 'react-router-dom';
import HomesafeLogo from '../../../assets/images/HomesafeLogo.png'
import HomesafeLogo2 from '../../../assets/images/HomesafeLogo2.svg'

interface HomesafeSignupPageProps {
  // Add any props if needed
}

const HomesafeForgotPasswordPage: React.FC<HomesafeSignupPageProps> = () => {
  const [email, setEmail] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    // Add your signup logic here
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left side with images, overlay, and mission statement */}
      <div className="hidden md:flex md:w-1/2 bg-white relative overflow-hidden">
        {/* Top image */}
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

        {/* Bottom image */}
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

        {/* Logo and mission statement overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          {/* Logo */}
          <div className="mb-8">
            <img src={HomesafeLogo} alt="Homesafe Logo" className="" />
          </div>

          {/* Mission statement */}
          <div className="max-w-md">
            <p className="text-center text-[#F4F4F4] text-[24px] font-normal">
              "Our Mission at Homesafe is to make hiring safe, simple, and efficient for every Living Space, and to create a job search space for Artisans to apply through".
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side with sign up form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-[545px] bg-white rounded-lg shadow-lg p-8">
         <h1 className='text-[36px] text-[#24292E] font-semibold'>Forgot Password</h1>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4 mt-[1rem]">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <Link to="/employer/forgot-password/otp">
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

export default HomesafeForgotPasswordPage;