import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import userApi from '../../api/userApi';
import { useNavigate } from 'react-router-dom';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string;
  [key: string]: any;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // userProfile state is used to store the full user data, but we extract specific fields to formData
  const [, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const profileData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phoneNumber,
        email: formData.email,
      };

      const response = await userApi.updateProfile(profileData);

      if (response.status) {
        // Show success message or notification
        alert('Profile updated successfully');
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError('Error updating profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <button
          className="flex items-center text-gray-600 hover:text-gray-800"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" />
          <span className="text-lg font-medium">Profile</span>
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-8 max-w-4xl mb-6">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full bg-[#D9D9D9] flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full" />
                )}
                <div className="absolute top-2 right-0 mr-2">
                  <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleDeleteImage}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                Delete Image
              </button>

              <label className="px-4 py-2 bg-[#A5EA91] text-[#24292E] rounded-md text-sm cursor-pointer hover:bg-green-200">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
                placeholder="eg. John"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-800 placeholder-[#BDC2C7]"
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
                placeholder="eg. Duke"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-800 placeholder-[#BDC2C7]"
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
          </div>
        </form>
      </div>

      <div className="flex justify-end max-w-4xl">
        <button
          onClick={handleSubmit}
          type="button"
          className="px-6 py-2 bg-[#A5EA91] text-[#24292E] rounded-md hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 mt-[1rem]"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
