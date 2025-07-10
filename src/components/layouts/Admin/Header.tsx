import React, { useState, useEffect, useRef } from 'react';
import { LuBellDot } from 'react-icons/lu';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import NotificationsModal from '../../common/NotificationsModal';
import EnvironmentIndicator from '../../common/EnvironmentIndicator';
import ProfileIcon from '../../../assets/icons/profile.svg';
import LogoutIcon from '../../../assets/icons/logout.svg';
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

const Header: React.FC<HeaderProps> = ({
  userEmail: propUserEmail,
  userName: propUserName,
}) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  // Loading state is used in the fetchUserProfile function
  const [, setLoading] = useState(true);
  // Error state is used in the fetchUserProfile function
  const [, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userApi.getProfile();
        if (response.status) {
          setUserProfile(response.data);
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

  // Use profile data or fallback to props
  const userName = userProfile?.first_name || propUserName || 'Admin';
  const userEmail = userProfile?.email || propUserEmail || 'admin@example.com';
  const userInitials = userProfile
    ? `${userProfile.first_name.charAt(0)}${userProfile.last_name.charAt(0)}`
    : 'A';

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-xl font-semibold text-gray-800">
              Welcome, {userName}
            </span>
            <EnvironmentIndicator />
          </div>

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
                  {userProfile?.avatar ? (
                    <img
                      src={userProfile.avatar}
                      alt={`${userName}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{userInitials}</span>
                  )}
                </div>

                {/* User email with dropdown */}
                <div className="flex items-center text-gray-700">
                  <span className="text-sm">{userEmail}</span>
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
                      navigate('/admin/profile');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <img src={ProfileIcon} className="mr-3" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/admin/security');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <img src={SecurityIcon} className="mr-3" />
                    Security
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <img src={LogoutIcon} className="mr-3" />
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
        portalType="admin"
      />
    </header>
  );
};

export default Header;
