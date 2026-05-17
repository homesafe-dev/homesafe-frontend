import React, { useState, useEffect } from 'react';
import { Camera, Trash2, Save } from 'lucide-react';
import userApi from '../../api/userApi';
import Avatar from '../../components/common/Avatar';
import Toast from '../../components/common/Toast';

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

const AdminProfilePage: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
  const [toast, setToast] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
    isVisible: false,
  });

  // Toast helper functions
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setProfileImage(null);
    setImageFile(null);
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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await userApi.getProfile();
        if (response.status) {
          const userData = response.data;

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
          setError('Failed to fetch user profile');
          showToast('Failed to fetch user profile', 'error');
        }
      } catch (err) {
        setError('Error fetching user profile');
        showToast('Error fetching user profile', 'error');
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
      setSaving(true);
      setError(null);

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

      // Handle profile image upload if a new file was selected
      if (imageFile) {
        formDataObj.append('avatar', imageFile);
      }

      const response = await userApi.updateProfile(formDataObj);

      if (response.status) {
        showToast('Profile updated successfully', 'success');
        // Refresh profile data
        const profileResponse = await userApi.getProfile();
        if (profileResponse.status) {
          const userData = profileResponse.data;
          if (userData.avatar) {
            setProfileImage(userData.avatar);
          }
        }
      } else {
        const errorMessage = response.message || 'Failed to update profile';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } catch (err) {
      const errorMessage = 'Error updating profile';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-0">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Profile Settings
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Manage your personal information and profile details
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit}>
            {/* Profile Image Section */}
            <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Avatar
                        src={null}
                        firstName={formData.firstName}
                        lastName={formData.lastName}
                        size="xl"
                        showStatus={false}
                      />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-sm">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors flex items-center justify-center gap-2">
                    <Camera className="w-4 h-4" />
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>

                  {profileImage && (
                    <button
                      type="button"
                      onClick={handleDeleteImage}
                      className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove Image
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields Section */}
            <div className="p-6 sm:p-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="e.g. John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="e.g. Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="e.g. 08012345678"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100 appearance-none bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
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
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="profileDescription"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 dark:bg-gray-800 dark:border-gray-700 resize-none"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
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

export default AdminProfilePage;
