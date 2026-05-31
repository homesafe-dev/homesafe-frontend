import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Shield,
  CheckCircle,
  IdCard,
  User,
  Save,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import userApi from '../../api/userApi';
import Toast from '../../components/common/Toast';

interface KYCFormData {
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
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<KYCFormData>({
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      // Validate form data
      if (!formData.ninNumber) {
        setError('Please enter your NIN number');
        return;
      }

      // Create payload for KYC API
      const kycPayload = {
        number: formData.ninNumber,
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
        setError(response.message || 'Failed to submit NIN verification');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Error submitting NIN verification'
      );
      console.error('Error submitting NIN verification:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-0">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            KYC Verification
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Verify your identity using your National Identification Number (NIN)
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : userProfile?.status === 1 ? (
        <div className="bg-surface rounded-lg shadow-sm border border-border-default p-6 sm:p-8">
          {/* Success Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                KYC Verification Complete
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your KYC verification has already been submitted and processed.
              </p>
            </div>
          </div>

          {/* User Name Display */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-border-default">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
            </div>
            <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {userProfile
                ? `${userProfile.first_name} ${userProfile.last_name}`
                : 'Loading...'}
            </div>
          </div>

          {/* Status Message */}
          <div className="mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-800 font-medium mb-1">
                    KYC Verification Status: Completed
                  </p>
                  <p className="text-green-700 text-sm">
                    Your identity has been successfully verified. You can now
                    access all platform features.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Dashboard Button */}
          <div className="flex justify-start">
            <button
              onClick={() => navigate('/employee/dashboard')}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-surface rounded-lg shadow-sm border border-border-default p-6 sm:p-8">
          {/* Header Section */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <IdCard className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                ID Verification
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please enter your National Identification Number (NIN) for
                verification. Use{' '}
                <span className="font-mono font-medium text-orange-600">
                  70123456789
                </span>{' '}
                for testing purposes.
              </p>
            </div>
          </div>

          {/* User Name Display */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-border-default">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
            </div>
            <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {userProfile
                ? `${userProfile.first_name} ${userProfile.last_name}`
                : 'Loading...'}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NIN Number */}
            <div>
              <label
                htmlFor="ninNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                NIN Number
              </label>
              <input
                type="text"
                id="ninNumber"
                name="ninNumber"
                placeholder="Enter your NIN number (e.g. 70123456789)"
                className="w-full px-4 py-2.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400"
                value={formData.ninNumber}
                onChange={handleInputChange}
                required
              />
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Enter your 11-digit National Identification Number
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-start pt-4 border-t border-border-default">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Start Verification Process</span>
                  </>
                )}
              </button>
            </div>
          </form>
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
