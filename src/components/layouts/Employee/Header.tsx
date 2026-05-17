import React, { useState, useEffect, useRef } from 'react';
import { Bell, BellDot, ChevronDown, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationsModal from '../../common/NotificationsModal';
import EnvironmentIndicator from '../../common/EnvironmentIndicator';
import ThemeToggle from '../../common/ThemeToggle';
import ProfileIcon from '../../../assets/icons/profile.svg';
import LogoutIcon from '../../../assets/icons/logout.svg';
import KycIcon from '../../../assets/icons/kyc.svg';
import SecurityIcon from '../../../assets/icons/security.svg';
import userApi from '../../../api/userApi';
import notificationApi from '../../../api/notificationApi';
import { hasUsableAvatarUrl } from '../../../utils/avatarUrl';

interface HeaderProps {
  userEmail?: string;
  userName?: string;
  onMenuToggle?: () => void;
  isMobile?: boolean;
}

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  role?: string[];
  [key: string]: any;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMobile = false }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  // Loading state is used in the fetchUserProfile function
  const [, setLoading] = useState(true);
  // Error state is used in the fetchUserProfile function
  const [, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);

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

    const fetchUnreadCount = async () => {
      try {
        const response = await notificationApi.getNotifications();
        if (response.status && response.data) {
          const unread = response.data.filter(
            (notif: any) => !notif.read_at
          ).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchUserProfile();
    fetchUnreadCount();
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

  useEffect(() => {
    setAvatarLoadFailed(false);
  }, [userProfile?.avatar]);

  const handleLogout = () => {
    // Clear auth token from localStorage
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  const userName = userProfile?.first_name || 'Employee';
  const fullName = userProfile
    ? `${userProfile.first_name} ${userProfile.last_name}`
    : 'Employee User';
  const userInitials = userProfile
    ? `${userProfile.first_name.charAt(0)}${userProfile.last_name.charAt(0)}`
    : 'EM';
  const avatarUrl = userProfile?.avatar?.trim() ?? '';
  const showAvatarImage =
    hasUsableAvatarUrl(userProfile?.avatar) && !avatarLoadFailed;

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
      <div className="px-3 sm:px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Welcome + Environment */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Mobile menu button */}
            {isMobile && (
              <button
                id="mobile-menu-button"
                onClick={onMenuToggle}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 lg:hidden flex-shrink-0"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <span className="hidden sm:block text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              Welcome, {userName}
            </span>
            <div className="hidden sm:block flex-shrink-0">
              <EnvironmentIndicator />
            </div>
          </div>

          {/* Right side - Notifications + Profile */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Notification bell with badge */}
            <button
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              {unreadCount > 0 ? (
                <>
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </>
              ) : (
                <BellDot className="w-5 h-5" />
              )}
            </button>

            {/* User profile with border separator */}
            {userProfile && (
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center gap-3"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-semibold overflow-hidden flex-shrink-0">
                      {showAvatarImage ? (
                        <img
                          src={avatarUrl}
                          alt={`${fullName}'s avatar`}
                          className="w-full h-full object-cover"
                          onError={() => setAvatarLoadFailed(true)}
                        />
                      ) : (
                        <span>{userInitials}</span>
                      )}
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {fullName}
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-50">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          navigate('/employee/profile');
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <img
                          src={ProfileIcon}
                          className="mr-3 w-4 h-4 dark:invert dark:brightness-200"
                          alt="Profile"
                        />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          navigate('/employee/security');
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <img
                          src={SecurityIcon}
                          className="mr-3 w-4 h-4 dark:invert dark:brightness-200"
                          alt="Security"
                        />
                        Security
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          navigate('/employee/kyc');
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <img src={KycIcon} className="mr-3 w-4 h-4" alt="KYC" />
                        KYC
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <img
                          src={LogoutIcon}
                          className="mr-3 w-4 h-4 dark:invert dark:brightness-200"
                          alt="Logout"
                        />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
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
