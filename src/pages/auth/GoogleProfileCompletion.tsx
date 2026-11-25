import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import {
  AuthSplitPage,
  AuthHeader,
  AuthPrimaryButton,
} from '../../components/auth/shared/AuthLayout';
import {
  authFieldClass,
  authFieldDisabledClass,
  authTextareaClass,
  authLabelClass,
  authPillInputBorderStyle,
} from '../../components/auth/shared/authStyles.ts';
import { authTokens } from '../../components/auth/shared/authTokens.ts';

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

    // Pre-fill form with Google data
    if (email && firstName && lastName) {
      setFormData((prev) => ({
        ...prev,
        email,
        first_name: firstName,
        last_name: lastName,
      }));
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
      // One-time token from the Google redirect proves the Google sign-in
      const profileToken =
        new URLSearchParams(window.location.search).get('profile_token') ?? '';
      const response = await axiosInstance.post(
        '/auth/google/complete-profile',
        { ...formData, profile_token: profileToken }
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

  const fieldStyle = authPillInputBorderStyle;

  return (
    <AuthSplitPage wide>
      <AuthHeader
        title="Complete your profile"
        subtitle="Please provide the following information to complete your account setup."
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <h2
              className="text-lg font-semibold border-b pb-2"
              style={{
                color: authTokens.titleColor,
                borderColor: authTokens.fieldBorder,
              }}
            >
              Personal Information
            </h2>
            <div>
              <label
                className={authLabelClass}
                style={{ color: authTokens.titleColor }}
              >
                Title
              </label>
              <select
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className={authFieldClass}
                style={fieldStyle}
              >
                <option value="">Select Title</option>
                <option value="mr">Mr</option>
                <option value="mrs">Mrs</option>
                <option value="ms">Ms</option>
                <option value="dr">Dr</option>
              </select>
            </div>

            <div>
              <label
                className={authLabelClass}
                style={{ color: authTokens.titleColor }}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className={authFieldDisabledClass}
                style={fieldStyle}
              />
              <p
                className="text-xs mt-1"
                style={{ color: authTokens.bodyColor }}
              >
                Email from Google account (verified)
              </p>
            </div>

            <div>
              <label
                className={authLabelClass}
                style={{ color: authTokens.titleColor }}
              >
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                disabled
                className={authFieldDisabledClass}
                style={fieldStyle}
              />
              <p
                className="text-xs mt-1"
                style={{ color: authTokens.bodyColor }}
              >
                Name from Google account
              </p>
            </div>

            <div>
              <label
                className={authLabelClass}
                style={{ color: authTokens.titleColor }}
              >
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                disabled
                className={authFieldDisabledClass}
                style={fieldStyle}
              />
              <p
                className="text-xs mt-1"
                style={{ color: authTokens.bodyColor }}
              >
                Name from Google account
              </p>
            </div>

            <div>
              <label
                className={authLabelClass}
                style={{ color: authTokens.titleColor }}
              >
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className={authFieldClass}
                style={fieldStyle}
              />
            </div>

            <div>
              <label
                className={authLabelClass}
                style={{ color: authTokens.titleColor }}
              >
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleTextareaChange}
                required
                rows={3}
                className={authTextareaClass}
                style={fieldStyle}
              />
            </div>

            <div>
              <label
                className={authLabelClass}
                style={{ color: authTokens.titleColor }}
              >
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className={authFieldClass}
                style={fieldStyle}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label
                className={authLabelClass}
                style={{ color: authTokens.titleColor }}
              >
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
                className={authFieldClass}
                style={fieldStyle}
              />
              <p
                className="text-xs mt-1"
                style={{ color: authTokens.bodyColor }}
              >
                Must be at least 18 years old
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <h2
              className="text-lg font-semibold border-b pb-2"
              style={{
                color: authTokens.titleColor,
                borderColor: authTokens.fieldBorder,
              }}
            >
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
                  className="h-4 w-4"
                  style={{ accentColor: authTokens.primaryDark }}
                />
                <label
                  htmlFor="employer"
                  className="text-base font-medium"
                  style={{ color: authTokens.titleColor }}
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
                  className="h-4 w-4"
                  style={{ accentColor: authTokens.primaryDark }}
                />
                <label
                  htmlFor="employee"
                  className="text-base font-medium"
                  style={{ color: authTokens.titleColor }}
                >
                  I am an Employee/Artisan
                </label>
              </div>
            </div>

            {formData.role === 'employee' && (
              <div
                className="mt-4 p-4 rounded-xl border"
                style={{
                  borderColor: authTokens.fieldBorder,
                  backgroundColor: '#fff',
                }}
              >
                <h3
                  className="text-base font-semibold mb-4"
                  style={{ color: authTokens.titleColor }}
                >
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
                        className="h-4 w-4"
                        style={{ accentColor: authTokens.primaryDark }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: authTokens.bodyColor }}
                      >
                        {occupation.name}
                      </span>
                    </label>
                  ))}
                </div>
                {formData.occupations.length === 0 && (
                  <p className="text-red-500 text-sm mt-2">
                    Please select at least one occupation
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div
          className="pt-6 border-t"
          style={{ borderColor: authTokens.fieldBorder }}
        >
          <AuthPrimaryButton
            loading={loading}
            loadingLabel="Completing profile..."
          >
            Complete Profile
          </AuthPrimaryButton>
        </div>
      </form>
    </AuthSplitPage>
  );
};

export default GoogleProfileCompletion;
