import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import userApi from '../../api/userApi';

interface KYCFormData {
  idType: string;
  ninNumber: string;
  dateOfBirth: string;
}

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  gender: string;
  [key: string]: any;
}

const EmployeeKYCPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<KYCFormData>({
    idType: '',
    ninNumber: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userApi.getProfile();
        if (response.status) {
          const userData = response.data;
          setUserProfile(userData);

          // Update form data with user profile information
          setFormData((prevFormData) => ({
            ...prevFormData,
            dateOfBirth: userData.dob || '',
          }));
        } else {
          setError('Failed to fetch user profile');
        }
      } catch (err) {
        setError('Error fetching user profile');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

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
      setSubmitting(true);
      setError(null);

      // Create FormData object for NIN verification
      const kycFormData = new FormData();
      kycFormData.append('id_type', formData.idType);
      kycFormData.append('nin_number', formData.ninNumber);
      kycFormData.append('dob', formData.dateOfBirth);

      const response = await userApi.submitKYC(kycFormData);

      if (response.status) {
        alert('NIN verification submitted successfully');
        navigate('/employee/dashboard');
      } else {
        setError(response.message || 'Failed to submit NIN verification');
      }
    } catch (err: any) {
      setError(err.message || 'Error submitting NIN verification');
      console.error('Error submitting NIN verification:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg w-full mx-auto">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <button
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="mr-2" />
            <span className="text-gray-800">Back</span>
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">KYC Verification</h1>
          <p className="text-gray-600 mt-2">Please enter your NIN and DOB for verification</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center mb-6">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg border-2 border-gray-300 shadow-sm p-12 max-w-3xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600 font-semibold">🆔</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">ID Verification</h2>
                <p className="text-sm text-orange-600">Your ID verification is required. Please submit a valid identification document by 31/12/24.</p>
              </div>
            </div>
          </div>

          {/* User Name Display */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <div className="text-lg font-medium text-gray-800">
              {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'Loading...'}
            </div>
          </div>

          {/* Instructional Text */}
          <div className="mb-8">
            <p className="text-gray-600">Please enter your NIN and DOB for verification</p>
          </div>

          {/* Form Container with Border */}
          <div className="border-2 border-gray-300 rounded-lg p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ID Type */}
              <div>
                <label htmlFor="idType" className="block text-sm font-medium text-gray-700 mb-2">
                  ID Type
                </label>
                <select
                  id="idType"
                  name="idType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700"
                  value={formData.idType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select ID Type</option>
                  <option value="nin">National Identification Number (NIN)</option>
                  <option value="virtual_nin">Virtual NIN</option>
                </select>
              </div>

              {/* NIN Number */}
              <div>
                <label htmlFor="ninNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  NIN Number
                </label>
                <input
                  type="text"
                  id="ninNumber"
                  name="ninNumber"
                  placeholder="12345678901"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                  value={formData.ninNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </form>
          </div>

          {/* Submit Button */}
          <div className="flex justify-start">
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-8 py-3 bg-green-300 text-black rounded-md hover:bg-green-400 transition-colors font-medium"
              disabled={submitting}
            >
              {submitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Start Verification Process'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeKYCPage;
