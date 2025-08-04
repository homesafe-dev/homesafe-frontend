import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import userApi from '../../api/userApi';
import Toast from '../../components/common/Toast';

interface KYCFormData {
  idType: string;
  ninNumber: string;
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<KYCFormData>({
    idType: '',
    ninNumber: '',
  });
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userApi.getProfile();
        if (response.status) {
          const userData = response.data;
          setUserProfile(userData);

          // User profile loaded successfully
        } else {
          showToast('Failed to fetch user profile', 'error');
        }
      } catch (err) {
        showToast('Error fetching user profile', 'error');
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

      // Validate form data
      if (!formData.idType || !formData.ninNumber) {
        showToast('Please fill in all required fields', 'error');
        return;
      }

      // Create payload for KYC API
      const kycPayload = {
        number: formData.ninNumber,
        type: formData.idType,
      };

      const response = await userApi.submitKYC(kycPayload);

      if (response.status) {
        showToast(
          response.message || 'KYC verification submitted successfully',
          'success'
        );
        setTimeout(() => {
          navigate('/employee/dashboard');
        }, 2000);
      } else {
        showToast(
          response.message || 'Failed to submit NIN verification',
          'error'
        );
      }
    } catch (err: any) {
      showToast(
        err.response?.data?.message ||
          err.message ||
          'Error submitting NIN verification',
        'error'
      );
      console.error('Error submitting NIN verification:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg w-full mx-auto px-4 sm:px-0">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Header */}
      <div className="mb-4 sm:mb-6 flex justify-between items-center">
        <div>
          <button
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="mr-2" />
            <span className="text-gray-800 text-sm sm:text-base">Back</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            KYC Verification
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Please enter your NIN for verification
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : userProfile?.status === 1 ? (
        <div className="bg-white rounded-lg border-2 border-gray-300 shadow-sm p-6 sm:p-8 lg:p-12 max-w-3xl">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-green-600 font-semibold text-sm sm:text-base">
                  ✅
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                  KYC Verification Complete
                </h2>
                <p className="text-xs sm:text-sm text-green-600">
                  Your KYC verification has already been submitted and
                  processed.
                </p>
              </div>
            </div>
          </div>

          {/* User Name Display */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <div className="text-lg font-medium text-gray-800">
              {userProfile
                ? `${userProfile.first_name} ${userProfile.last_name}`
                : 'Loading...'}
            </div>
          </div>

          {/* Status Message */}
          <div className="mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                ✅ KYC Verification Status: Completed
              </p>
              <p className="text-green-600 text-sm mt-1">
                Your identity has been successfully verified. You can now access
                all platform features.
              </p>
            </div>
          </div>

          {/* Back to Dashboard Button */}
          <div className="flex justify-start">
            <button
              onClick={() => navigate('/employee/dashboard')}
              className="px-8 py-3 bg-green-300 text-black rounded-md hover:bg-green-400 transition-colors font-medium"
            >
              Back to Dashboard
            </button>
          </div>
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
                <h2 className="text-lg font-semibold text-gray-800">
                  ID Verification
                </h2>
                <p className="text-sm text-orange-600">
                  Please use 1000000001 for NIN number & JZ426633988976CH for
                  V-NIN verification
                </p>
              </div>
            </div>
          </div>

          {/* User Name Display */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <div className="text-lg font-medium text-gray-800">
              {userProfile
                ? `${userProfile.first_name} ${userProfile.last_name}`
                : 'Loading...'}
            </div>
          </div>

          {/* Instructional Text */}
          <div className="mb-8">
            <p className="text-gray-600">
              Please enter your NIN for verification
            </p>
          </div>

          {/* Form Container with Border */}
          <div className="border-2 border-gray-300 rounded-lg p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ID Type */}
              <div>
                <label
                  htmlFor="idType"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
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
                  <option value="nin">
                    National Identification Number (NIN)
                  </option>
                  <option value="v_nin">Virtual NIN</option>
                </select>
              </div>

              {/* NIN Number */}
              <div>
                <label
                  htmlFor="ninNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  NIN Number
                </label>
                <input
                  type="text"
                  id="ninNumber"
                  name="ninNumber"
                  placeholder="Enter your NIN or Virtual NIN"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                  value={formData.ninNumber}
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

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default EmployeeKYCPage;
