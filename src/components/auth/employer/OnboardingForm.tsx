import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import {
  AuthSplitPage,
  AuthHeader,
  AuthPrimaryButton,
} from '../shared/AuthLayout';

interface Occupation {
  id: number;
  name: string;
}

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
    occupation: 0, // Add occupation field as number (ID)
  });
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [loadingOccupations, setLoadingOccupations] = useState<boolean>(false);
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

    // Fetch occupations
    const fetchOccupations = async () => {
      try {
        setLoadingOccupations(true);
        const response = await adminApi.getOccupations();
        if (response.status && response.data) {
          setOccupations(response.data);
        } else {
          console.error('Failed to fetch occupations:', response.message);
        }
      } catch (err) {
        console.error('Error fetching occupations:', err);
      } finally {
        setLoadingOccupations(false);
      }
    };

    fetchOccupations();
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

  const handleOccupationChange = (occupationId: number) => {
    setFormData((prev) => ({
      ...prev,
      occupation: occupationId,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Validation for employees/agents - they need to select an occupation
    if (formData.userType === 'agent' && !formData.occupation) {
      setErrorMessage('Please select an occupation');
      setIsSubmitting(false);
      return;
    }

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
        occupation: formData.occupation, // Add occupation to registration data
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
    <AuthSplitPage>
      <AuthHeader
        title="Welcome onboard"
        subtitle="Kindly tell us a few things about you."
      />

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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base bg-gray-100 cursor-not-allowed"
            value={formData.email}
            onChange={handleChange}
            required
            readOnly
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
                An Artisan
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
              <label htmlFor="female" className="ml-2 text-sm text-gray-700">
                Female
              </label>
            </div>
          </div>
        </div>

        {/* Occupation field - only show for agents/employees */}
        {formData.userType === 'agent' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Occupation *
            </label>
            {loadingOccupations ? (
              <div className="text-sm text-gray-500">
                Loading occupations...
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3">
                {occupations
                  .sort((a, b) =>
                    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
                  )
                  .map((occupation) => {
                    const formattedName =
                      occupation.name.charAt(0).toUpperCase() +
                      occupation.name.slice(1).toLowerCase();
                    return (
                      <label key={occupation.id} className="flex items-center">
                        <input
                          type="radio"
                          name="occupation"
                          checked={formData.occupation === occupation.id}
                          onChange={() => handleOccupationChange(occupation.id)}
                          className="mr-2 h-4 w-4 text-green-500 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">
                          {formattedName}
                        </span>
                      </label>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {errorMessage && (
          <p className="text-sm text-red-600 text-center">{errorMessage}</p>
        )}
        <AuthPrimaryButton loading={isSubmitting} loadingLabel="Submitting...">
          Save &amp; Continue
        </AuthPrimaryButton>
      </form>
    </AuthSplitPage>
  );
};

export default OnboardingForm;
