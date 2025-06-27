import React, { useState, useEffect, useRef } from 'react';
import { LuBellDot } from 'react-icons/lu';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import NotificationsModal from '../../common/NotificationsModal';
import ProfileIcon from '../../../assets/icons/profile.svg';
import LogoutIcon from '../../../assets/icons/logout.svg';
import KycIcon from '../../../assets/icons/kyc.svg';
import SecurityIcon from '../../../assets/icons/security.svg';
import userApi from '../../../api/userApi';

interface HeaderProps {
  userEmail?: string;
  userName?: string;
}

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  [key: string]: any;
}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  // Loading state is used in the fetchUserProfile function
  const [, setLoading] = useState(true);
  // Error state is used in the fetchUserProfile function
  const [, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userApi.getProfile();
        if (response.status) {
          setUserProfile(response.data);
        } else {
          setError('Failed to fetch user profile');
          console.error('Failed to fetch user profile:', response.message);
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

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear auth token from localStorage
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (userProfile) {
      const firstInitial = userProfile.first_name
        ? userProfile.first_name.charAt(0)
        : '';
      const lastInitial = userProfile.last_name
        ? userProfile.last_name.charAt(0)
        : '';
      return `${firstInitial}${lastInitial}`.toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-end items-center">
          {/* Right side - User info and controls */}
          <div className="flex items-center space-x-4">
            {/* Notification bell */}
            <button
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={() => setIsModalOpen(true)}
            >
              <LuBellDot size={22} className="text-gray-600" />
            </button>

            {/* User profile */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-2"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-white overflow-hidden">
                  {userProfile && userProfile.avatar ? (
                    <img
                      src={userProfile.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{getUserInitials()}</span>
                  )}
                </div>

                {/* User email with dropdown */}
                <div className="flex items-center text-gray-700">
                  <span className="text-sm">
                    {userProfile ? userProfile.email : 'Loading...'}
                  </span>
                  <MdOutlineKeyboardArrowDown
                    size={20}
                    className="text-gray-500"
                  />
                </div>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-4 ml-8 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/employee/profile');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <img src={ProfileIcon} className="mr-3" alt="Profile" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/employee/security');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <img src={SecurityIcon} className="mr-3" alt="Security" />
                    Security
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/employee/kyc');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <img src={KycIcon} className="mr-3" alt="KYC" />
                    KYC
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <img src={LogoutIcon} className="mr-3" alt="Logout" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        portalType="employee"
      />
    </header>
  );
};

export default Header;
