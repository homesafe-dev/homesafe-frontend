import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';

interface Occupation {
  id: number;
  name: string;
}

interface ProfileFormData {
  email: string;
  title: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  gender: string;
  dob: string;
  role: string;
  occupations: number[];
}

const GoogleProfileCompletion: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [formData, setFormData] = useState<ProfileFormData>({
    email: '',
    title: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    gender: '',
    dob: '',
    role: '',
    occupations: [],
  });

  useEffect(() => {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const firstName = params.get('first_name');
    const lastName = params.get('last_name');

    console.log('Google Profile Completion - URL Parameters:', {
      email,
      firstName,
      lastName,
      allParams: Object.fromEntries(params.entries()),
    });

    // Pre-fill form with Google data
    if (email && firstName && lastName) {
      setFormData((prev) => ({
        ...prev,
        email,
        first_name: firstName,
        last_name: lastName,
      }));

      console.log('Google Profile Completion - Form data updated:', {
        email,
        first_name: firstName,
        last_name: lastName,
      });
    } else {
      console.warn('Google Profile Completion - Missing required parameters:', {
        email: !!email,
        firstName: !!firstName,
        lastName: !!lastName,
      });
    }

    // Fetch occupations for employee role
    fetchOccupations();
  }, []);

  const fetchOccupations = async () => {
    try {
      const response = await axiosInstance.get('/occupations');
      setOccupations(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch occupations:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOccupationChange = (occupationId: number) => {
    setFormData((prev) => ({
      ...prev,
      occupations: prev.occupations.includes(occupationId)
        ? prev.occupations.filter((id) => id !== occupationId)
        : [...prev.occupations, occupationId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Client-side validation for date of birth
    if (formData.dob) {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dobDate.getDate())
      ) {
        // Adjust age if birthday hasn't occurred this year
        const actualAge = age - 1;
        if (actualAge < 18) {
          alert('You must be at least 18 years old to register.');
          setLoading(false);
          return;
        }
      } else if (age < 18) {
        alert('You must be at least 18 years old to register.');
        setLoading(false);
        return;
      }
    }

    try {
      const response = await axiosInstance.post(
        '/auth/google/complete-profile',
        formData
      );

      if (response.data.status) {
        // Store token and user data
        localStorage.setItem('auth_token', response.data.data.token);
        // Redirect to appropriate dashboard
        const role = response.data.data.role;
        if (role) {
          window.location.replace(`/${role}/dashboard`);
        } else {
          window.location.replace('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Profile completion failed:', error);
      alert(error.response?.data?.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Complete Your Profile
          </h1>
          <p className="mt-2 text-gray-600">
            Please provide the following information to complete your account
            setup
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Personal Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Personal Information
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Title</option>
                  <option value="mr">Mr</option>
                  <option value="mrs">Mrs</option>
                  <option value="ms">Ms</option>
                  <option value="dr">Dr</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email from Google account (verified)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Name from Google account
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Name from Google account
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleTextareaChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth (Optional)
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  max={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 18)
                    )
                      .toISOString()
                      .split('T')[0]
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 18 years old
                </p>
              </div>
            </div>

            {/* Right Side - Role Selection */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Choose Your Role
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="employer"
                    name="role"
                    value="employer"
                    checked={formData.role === 'employer'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                  />
                  <label
                    htmlFor="employer"
                    className="text-lg font-medium text-gray-900"
                  >
                    I am an Employer
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="employee"
                    name="role"
                    value="employee"
                    checked={formData.role === 'employee'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                  />
                  <label
                    htmlFor="employee"
                    className="text-lg font-medium text-gray-900"
                  >
                    I am an Employee/Artisan
                  </label>
                </div>
              </div>

              {/* Occupation Selection for Employees */}
              {formData.role === 'employee' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Select Your Occupations
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {occupations.map((occupation) => (
                      <label
                        key={occupation.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={formData.occupations.includes(occupation.id)}
                          onChange={() => handleOccupationChange(occupation.id)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">
                          {occupation.name}
                        </span>
                      </label>
                    ))}
                  </div>
                  {formData.role === 'employee' &&
                    formData.occupations.length === 0 && (
                      <p className="text-red-500 text-sm mt-2">
                        Please select at least one occupation
                      </p>
                    )}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Completing Profile...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoogleProfileCompletion;
