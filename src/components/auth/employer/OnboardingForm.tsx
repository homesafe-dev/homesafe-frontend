import React, { useState, useEffect } from 'react';
import signupImg1 from '../../../assets/images/signupImg1.png';
import signupImg2 from '../../../assets/images/signupImg2.png';
import { useNavigate, Link } from 'react-router-dom';
import HomesafeLogo from '../../../assets/images/HomesafeLogo.png';

const OnboardingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    homeAddress: '',
    userType: 'employer',
    gender: 'male', // Default value
  });
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // We don't need the auth context for this component anymore
  const navigate = useNavigate();

  useEffect(() => {
    // Get email and password from session storage
    const storedEmail = sessionStorage.getItem('signupEmail');
    const storedPassword = sessionStorage.getItem('signupPassword');

    if (!storedEmail || !storedPassword) {
      // Redirect back to signup page if email or password is not found
      navigate('/signup');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      email: storedEmail,
    }));

    setPassword(storedPassword);
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      userType: value,
    }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const registrationData = {
        email: formData.email,
        password: password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phoneNumber,
        address: formData.homeAddress,
        gender: formData.gender,
        is_employer: formData.userType === 'employer' ? true : false,
      };

      // Store registration data in sessionStorage for the facial capture page
      sessionStorage.setItem(
        'registrationData',
        JSON.stringify(registrationData)
      );

      // Navigate to facial capture page
      navigate('/signup/facial-capture');
    } catch (err) {
      console.error('Error in onboarding form submission:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
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

      {/* Right side with onboarding form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-6 md:p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 md:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-[36px] font-semibold text-[#24292E]">
              Welcome Onboard
            </h1>
            <p className="text-[13px] text-[#24292E] mt-2">
              Kindly tell us a few things about you
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-[13px] font-medium text-[#24292E] mb-1"
              >
                Title
              </label>
              <select
                id="title"
                name="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
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
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="name@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="07012345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="homeAddress"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Home Address
              </label>
              <input
                type="text"
                id="homeAddress"
                name="homeAddress"
                placeholder="Enter your address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                value={formData.homeAddress}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What are you?
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="employer"
                    name="userType"
                    className="h-4 w-4 text-green-500 focus:ring-green-500"
                    checked={formData.userType === 'employer'}
                    onChange={() => handleRadioChange('employer')}
                  />
                  <label
                    htmlFor="employer"
                    className="ml-2 text-sm text-gray-700"
                  >
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
                    An Employee
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    className="h-4 w-4 text-green-500 focus:ring-green-500"
                    checked={formData.gender === 'male'}
                    onChange={() => handleGenderChange('male')}
                  />
                  <label htmlFor="male" className="ml-2 text-sm text-gray-700">
                    Male
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    className="h-4 w-4 text-green-500 focus:ring-green-500"
                    checked={formData.gender === 'female'}
                    onChange={() => handleGenderChange('female')}
                  />
                  <label
                    htmlFor="female"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Female
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="other"
                    name="gender"
                    className="h-4 w-4 text-green-500 focus:ring-green-500"
                    checked={formData.gender === 'other'}
                    onChange={() => handleGenderChange('other')}
                  />
                  <label htmlFor="other" className="ml-2 text-sm text-gray-700">
                    Other
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full bg-green-300 text-black py-2 px-4 rounded-md hover:bg-green-400 transition-colors mt-6 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Save & Continue'}
            </button>
            {errorMessage && (
              <p className="mt-2 text-sm text-red-600 text-center">
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
