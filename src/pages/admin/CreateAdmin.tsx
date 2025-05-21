import React, { useState } from 'react';
import { FaArrowLeft, FaChevronDown } from 'react-icons/fa';
import { LuCalendarDays } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import adminSettingsApi from '../../api/adminSettingsApi';

interface AdminFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
}

const CreateAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AdminFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Validate form data
      if (!formData.firstName || !formData.lastName || !formData.email || 
          !formData.phoneNumber || !formData.dateOfBirth || !formData.gender) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      // In a real app, this would be an API call
      // const adminData = {
      //   first_name: formData.firstName,
      //   last_name: formData.lastName,
      //   email: formData.email,
      //   phone: formData.phoneNumber,
      //   dob: formData.dateOfBirth,
      //   gender: formData.gender,
      // };
      // const response = await adminSettingsApi.createAdmin(adminData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect back to admin settings page
      navigate('/admin/admin-settings');
    } catch (err: any) {
      setError(err.message || 'Error creating admin');
      console.error('Error creating admin:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-6">
        <button
          className="flex items-center text-gray-600 hover:text-gray-800"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" />
          <span className="text-gray-800">Create New Admin</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 gap-6">
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
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.firstName}
              onChange={handleInputChange}
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
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.lastName}
              onChange={handleInputChange}
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
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.email}
              onChange={handleInputChange}
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
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                placeholder="dd/mm/yyyy"
                className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <LuCalendarDays />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Gender
            </label>
            <div className="relative">
              <select
                id="gender"
                name="gender"
                className="appearance-none w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-700"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <FaChevronDown />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 bg-[#A5EA91] text-green-700 rounded-md hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-700 mr-2"></div>
                Processing...
              </div>
            ) : (
              'Save Information'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAdmin;
