import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import userApi from '../../api/userApi';
import { useNavigate } from 'react-router-dom';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  gender: string;
  dob: string;
  address: string;
  profileDescription: string;
}

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  phone: string;
  avatar: string;
  gender: string;
  dob: string;
  address: string;
  status: number;
  is_verified: number;
  salary: string;
  profile_description: string;
  [key: string]: any;
}

const EmployeeProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // userProfile state is used to store the full user data, but we extract specific fields to formData
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    gender: '',
    dob: '',
    address: '',
    profileDescription: '',
  });

  // Salary update modal states
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [salaryData, setSalaryData] = useState({
    salary: '',
    change_reason: '',
    effective_date: '',
  });
  const [salaryLoading, setSalaryLoading] = useState(false);

  // Toast notification states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Show toast notification
  const showToastNotification = (
    message: string,
    type: 'success' | 'error'
  ) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    // Auto-hide after 4 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleDeleteImage = () => {
    setProfileImage(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSalaryInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSalaryData({
      ...salaryData,
      [name]: value,
    });
  };

  const handleSalaryUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    try {
      setSalaryLoading(true);

      const response = await userApi.updateSalary(userProfile.id, {
        salary: parseFloat(salaryData.salary),
        change_reason: salaryData.change_reason,
        effective_date: salaryData.effective_date,
      });

      if (response.status) {
        // Update the user profile with new salary
        setUserProfile((prev) =>
          prev ? { ...prev, salary: response.data.salary.toString() } : null
        );
        setShowSalaryModal(false);
        setSalaryData({ salary: '', change_reason: '', effective_date: '' });
        showToastNotification('Salary updated successfully!', 'success');
      } else {
        showToastNotification(
          response.message || 'Failed to update salary',
          'error'
        );
      }
    } catch (err) {
      showToastNotification('Error updating salary', 'error');
      console.error('Error updating salary:', err);
    } finally {
      setSalaryLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userApi.getProfile();
        if (response.status) {
          const userData = response.data;
          setUserProfile(userData);

          // Set profile image if available
          if (userData.avatar) {
            setProfileImage(userData.avatar);
          }

          // Update form data with user profile information
          setFormData({
            firstName: userData.first_name || '',
            lastName: userData.last_name || '',
            phoneNumber: userData.phone || '',
            email: userData.email || '',
            gender: userData.gender || '',
            dob: userData.dob || '',
            address: userData.address || '',
            profileDescription: userData.profile_description || '',
          });
        } else {
          showToastNotification('Failed to fetch user profile', 'error');
        }
      } catch (err) {
        showToastNotification('Error fetching user profile', 'error');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Create FormData object for file upload
      const formDataObj = new FormData();

      // Add all form fields to FormData
      formDataObj.append('first_name', formData.firstName);
      formDataObj.append('last_name', formData.lastName);
      formDataObj.append('phone', formData.phoneNumber);
      formDataObj.append('email', formData.email);
      formDataObj.append('gender', formData.gender);
      formDataObj.append('dob', formData.dob);
      formDataObj.append('address', formData.address);
      formDataObj.append('profile_description', formData.profileDescription);

      // Handle profile image upload if it's a File object (not a URL string)
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        formDataObj.append('avatar', fileInput.files[0]);
      }

      const response = await userApi.updateProfile(formDataObj);

      if (response.status) {
        showToastNotification('Profile updated successfully', 'success');
      } else {
        showToastNotification(
          response.message || 'Failed to update profile',
          'error'
        );
      }
    } catch (err) {
      showToastNotification('Error updating profile', 'error');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-0">
      <div className="mb-4 sm:mb-6">
        <button
          className="flex items-center text-gray-600 hover:text-gray-800"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" />
          <span className="text-base sm:text-lg font-medium">
            Employee Profile
          </span>
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:p-8 max-w-4xl mb-6">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="relative mb-4">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#D9D9D9] flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full" />
                )}
                <div className="absolute top-1 right-0 sm:top-2 mr-1 sm:mr-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleDeleteImage}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm hover:bg-gray-50 w-full sm:w-auto"
              >
                Delete Image
              </button>

              <label className="px-3 sm:px-4 py-2 bg-[#A5EA91] text-[#24292E] rounded-md text-xs sm:text-sm cursor-pointer hover:bg-green-200 text-center w-full sm:w-auto">
                Change Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="eg. John"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-800 placeholder-[#BDC2C7] text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="eg. Duke"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-800 placeholder-[#BDC2C7] text-sm"
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
                placeholder="e.g 080*******"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-800 placeholder-[#BDC2C7]"
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
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-800 placeholder-[#BDC2C7]"
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-800"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-800"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Your address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-800 placeholder-[#BDC2C7]"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="profileDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Profile Description
              </label>
              <textarea
                id="profileDescription"
                name="profileDescription"
                placeholder="Tell us about yourself"
                value={formData.profileDescription}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-800 placeholder-[#BDC2C7]"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Salary Section */}
      <div className="bg-white rounded-lg shadow p-8 max-w-4xl mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Salary Information
          </h3>
          <button
            onClick={() => setShowSalaryModal(true)}
            className="flex items-center px-4 py-2 bg-[#A5EA91] text-[#24292E] rounded-md hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <FaEdit className="mr-2" />
            Update Salary
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">
              Current Salary:
            </span>
            <span className="text-lg font-bold text-gray-900">
              ₦
              {userProfile?.salary
                ? parseFloat(userProfile.salary).toLocaleString()
                : '0'}
            </span>
          </div>
        </div>
      </div>

      {/* Salary Update Modal */}
      {showSalaryModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Update Salary
              </h3>
              <button
                onClick={() => setShowSalaryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalaryUpdate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Salary (₦)
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={salaryData.salary}
                    onChange={handleSalaryInputChange}
                    placeholder="e.g. 50000"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Change
                  </label>
                  <textarea
                    name="change_reason"
                    value={salaryData.change_reason}
                    onChange={handleSalaryInputChange}
                    placeholder="e.g. Annual raise, Promotion, Performance bonus"
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Effective Date
                  </label>
                  <input
                    type="date"
                    name="effective_date"
                    value={salaryData.effective_date}
                    onChange={handleSalaryInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowSalaryModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={salaryLoading}
                  className="px-4 py-2 bg-[#A5EA91] text-[#24292E] rounded-md hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {salaryLoading ? 'Updating...' : 'Update Salary'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-end max-w-4xl">
        <button
          onClick={handleSubmit}
          type="button"
          className="px-6 py-2 bg-[#A5EA91] text-[#24292E] rounded-md hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 mt-[1rem]"
        >
          Save Changes
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
            toastType === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{toastMessage}</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfilePage;
