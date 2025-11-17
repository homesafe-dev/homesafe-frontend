import React, { useState, useEffect, useRef } from 'react';
import { Bell, BellDot, ChevronDown, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationsModal from '../../common/NotificationsModal';
import EnvironmentIndicator from '../../common/EnvironmentIndicator';
import ProfileIcon from '../../../assets/icons/profile.svg';
import LogoutIcon from '../../../assets/icons/logout.svg';
import KycIcon from '../../../assets/icons/kyc.svg';
import SecurityIcon from '../../../assets/icons/security.svg';
import userApi from '../../../api/userApi';
import notificationApi from '../../../api/notificationApi';
import Toast from '../../common/Toast';

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  gender: string;
  dob: string;
  phone: string;
  address: string;
  status: number;
  is_verified: number;
  salary: string;
  profile_description: string | null;
  wallet: {
    initial_balance: string;
    current_balance: string;
  };
  role: string[];
}

interface HeaderProps {
  userEmail?: string;
  userName?: string;
  onMenuToggle?: () => void;
  isMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMobile = false }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await userApi.getProfile();
        if (response.status) {
          setUserProfile(response.data);
        } else {
          const errorMessage =
            response.message || 'Failed to fetch user profile';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        }
      } catch (err) {
        const errorMessage = 'Error fetching user profile';
        setError(errorMessage);
        showToast(errorMessage, 'error');
        console.error('Error fetching user profile:', err);
      } finally {
        setIsLoading(false);
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

  const handleLogout = () => {
    // Clear auth token from localStorage
    localStorage.removeItem('auth_token');
    // Redirect to agent login page
    navigate('/login');
  };

  const userName = userProfile?.first_name || 'Agent';
  const fullName = userProfile
    ? `${userProfile.first_name} ${userProfile.last_name}`
    : 'Agent User';
  const userRole =
    userProfile?.role && userProfile.role.length > 0
      ? userProfile.role[0].charAt(0).toUpperCase() +
        userProfile.role[0].slice(1)
      : 'Agent';
  const userInitials = userProfile
    ? `${userProfile.first_name.charAt(0)}${userProfile.last_name.charAt(0)}`
    : 'AG';

  return (
    <header className="bg-white border-b border-gray-100">
      {error && (
        <div className="text-red-500 text-sm p-2 text-center">{error}</div>
      )}
      <div className="px-3 sm:px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Welcome + Environment */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Mobile menu button */}
            {isMobile && (
              <button
                id="mobile-menu-button"
                onClick={onMenuToggle}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 lg:hidden flex-shrink-0"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            {isLoading ? (
              <span className="hidden sm:block text-lg font-semibold text-gray-900">
                Loading...
              </span>
            ) : (
              <span className="hidden sm:block text-lg font-semibold text-gray-900 truncate">
                Welcome, {userName}
              </span>
            )}
            <div className="hidden sm:block flex-shrink-0">
              <EnvironmentIndicator />
            </div>
          </div>

          {/* Right side - Notifications + Profile */}
          <div className="flex items-center gap-3">
            {/* Notification bell with badge */}
            <button
              className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
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
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center gap-3"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold overflow-hidden flex-shrink-0">
                      {userProfile.avatar ? (
                        <img
                          src={userProfile.avatar}
                          alt={`${fullName}'s avatar`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{userInitials}</span>
                      )}
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-medium text-gray-900">
                        {fullName}
                      </div>
                      <div className="text-xs text-gray-500">{userRole}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          navigate('/agent/profile');
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={ProfileIcon}
                          className="mr-3 w-4 h-4"
                          alt=""
                        />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          navigate('/agent/security');
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={SecurityIcon}
                          className="mr-3 w-4 h-4"
                          alt=""
                        />
                        Security
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          navigate('/agent/kyc');
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <img src={KycIcon} className="mr-3 w-4 h-4" alt="" />
                        KYC
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <img src={LogoutIcon} className="mr-3 w-4 h-4" alt="" />
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
        portalType="agent"
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </header>
  );
};

export default Header;
