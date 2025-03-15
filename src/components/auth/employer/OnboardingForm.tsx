import React, { useState } from 'react';
import signupImg1 from '../../../assets/images/signupimg1.png';
import signupImg2 from '../../../assets/images/signupimg2.png';
import { Link } from 'react-router-dom';
import HomesafeLogo from '../../../assets/images/HomesafeLogo.png'

interface HomesafeSignupPageProps {
  // Add any props if needed
}

const OnboardingForm: React.FC<HomesafeSignupPageProps> = () => {
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    homeAddress: '',
    userType: 'employer'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      userType: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
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
      
      {/* Right side with onboarding form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-[36px] font-semibold text-[#24292E]">Welcome Onboard</h1>
            <p className="text-[13px] text-[#24292E] mt-2">Kindly tell us a few things about you</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-[13px] font-medium text-[#24292E] mb-1">
                Title
              </label>
              <select
                id="title"
                name="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.title}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
              </select>
            </div>
            
            {/* First Name Field */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            {/* Last Name Field */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="name@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            {/* Phone Number Field */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="07012345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            
            {/* Home Address Field */}
            <div>
              <label htmlFor="homeAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Home Address
              </label>
              <input
                type="text"
                id="homeAddress"
                name="homeAddress"
                placeholder="home@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.homeAddress}
                onChange={handleChange}
                required
              />
            </div>
            
            {/* User Type Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What are you?
              </label>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="employer"
                    name="userType"
                    className="h-4 w-4 text-green-500 focus:ring-green-500"
                    checked={formData.userType === 'employer'}
                    onChange={() => handleRadioChange('employer')}
                  />
                  <label htmlFor="employer" className="ml-2 text-sm text-gray-700">
                    An Employer
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="agent"
                    name="userType"
                    className="h-4 w-4 text-green-500 focus:ring-green-500"
                    checked={formData.userType === 'agent'}
                    onChange={() => handleRadioChange('agent')}
                  />
                  <label htmlFor="agent" className="ml-2 text-sm text-gray-700">
                    An Agent
                  </label>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <Link to="/employer/signup/facial-capture"><button
              type="submit"
              className="w-full bg-green-300 text-black py-2 px-4 rounded-md hover:bg-green-400 transition-colors mt-4"
            >
              Save & Continue
            </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;