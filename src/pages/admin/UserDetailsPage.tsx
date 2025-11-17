import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserCheck,
  UserX,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  Shield,
} from 'lucide-react';
import { format } from 'date-fns';
import adminApi from '../../api/adminApi';
import ApproveUserModal from '../../components/admin/ApproveUserModal';
import DeclineUserModal from '../../components/admin/DeclineUserModal';
import Avatar from '../../components/common/Avatar';

interface UserDetails {
  id: number;
  first_name: string;
  last_name: string;
  title: string;
  username: string | null;
  email: string;
  email_verified_at: string;
  avatar: string;
  gender: string;
  dob: string;
  phone: string;
  address: string;
  status: number;
  is_verified: number;
  approval_status: string;
  salary: string;
  profile_description: string | null;
  created_at: string;
  updated_at: string;
  occupation?: string;
  occupations?: Array<{
    id: number;
    name: string;
  }>;
}

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [userType, setUserType] = useState<
    'employee' | 'employer' | 'agent' | null
  >(null);

  // Helper function to get user's occupations
  const getUserOccupations = (user: UserDetails): string => {
    if (user.occupations && user.occupations.length > 0) {
      return user.occupations
        .map((occ) => occ.name.charAt(0).toUpperCase() + occ.name.slice(1))
        .join(', ');
    }
    return 'No occupation';
  };

  // Helper function to normalize user data
  const normalizeUserData = (userData: any): UserDetails => {
    // Normalize is_verified: handle boolean, number (0/1), string ("0"/"1"/"true"/"false")
    let isVerified = 0;
    if (typeof userData.is_verified === 'boolean') {
      isVerified = userData.is_verified ? 1 : 0;
    } else if (typeof userData.is_verified === 'number') {
      isVerified = userData.is_verified === 1 ? 1 : 0;
    } else if (typeof userData.is_verified === 'string') {
      const value = userData.is_verified.toLowerCase().trim();
      isVerified = value === '1' || value === 'true' || value === 'yes' ? 1 : 0;
    } else {
      // Default to 0 if undefined/null or unexpected type
      isVerified = userData.is_verified === true ? 1 : 0;
    }

    // Normalize approval_status: handle different possible values
    let approvalStatus = userData.approval_status || 'pending';
    if (typeof approvalStatus === 'string') {
      approvalStatus = approvalStatus.toLowerCase();
    }

    return {
      id: userData.id,
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      title: userData.title || 'Mr',
      username: userData.username || null,
      email: userData.email || '',
      email_verified_at: userData.email_verified_at || '',
      avatar: userData.avatar || '',
      gender: userData.gender || 'Not specified',
      dob: userData.dob || '',
      phone: userData.phone || '',
      address: userData.address || '',
      status: userData.status || 0,
      is_verified: isVerified,
      approval_status: approvalStatus,
      salary: userData.salary || '',
      profile_description: userData.profile_description || null,
      created_at: userData.created_at || '',
      updated_at: userData.updated_at || '',
      occupation: userData.occupation,
      occupations: userData.occupations || [],
    };
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const userId = parseInt(id || '0');
        if (!userId) {
          setError('Invalid user ID');
          setLoading(false);
          return;
        }

        // Use the direct user endpoint
        try {
          const response = await adminApi.getUserById(userId);

          // Handle response structure: { status: true, message: "...", data: { ...userData } }
          // Note: adminApi.getUserById returns response.data from axios, so response is already the API response object
          let userData = null;
          if (response.status && response.data) {
            // Standard structure: response.data contains the user data object
            userData = response.data;
          } else if (response.data) {
            // Fallback: if response.data exists but no status, use it directly
            userData = response.data;
          } else if (response && !response.status) {
            // If response itself is the user data (no wrapper)
            userData = response;
          }

          if (userData) {
            // Determine user type from roles or other indicators
            const roles = userData.roles || userData.role || [];
            let detectedUserType: 'employee' | 'employer' | 'agent' | null =
              null;

            if (Array.isArray(roles)) {
              if (
                roles.some(
                  (r: any) => r.name === 'employee' || r === 'employee'
                )
              ) {
                detectedUserType = 'employee';
              } else if (
                roles.some(
                  (r: any) => r.name === 'employer' || r === 'employer'
                )
              ) {
                detectedUserType = 'employer';
              } else if (
                roles.some((r: any) => r.name === 'agent' || r === 'agent')
              ) {
                detectedUserType = 'agent';
              }
            } else if (typeof roles === 'string') {
              if (roles === 'employee') detectedUserType = 'employee';
              else if (roles === 'employer') detectedUserType = 'employer';
              else if (roles === 'agent') detectedUserType = 'agent';
            }

            // If we can't determine from roles, try to infer from other fields
            if (!detectedUserType) {
              // Check if user has occupations (typically employees)
              if (userData.occupations && userData.occupations.length > 0) {
                detectedUserType = 'employee';
              }
              // You could add more logic here to detect employer/agent
            }

            setUser(normalizeUserData(userData));
            setUserType(detectedUserType);
            setLoading(false);
            return;
          }

          setError('User data not found in response');
        } catch (err: any) {
          console.error('Error fetching user by ID:', err);
          setError(
            err.response?.data?.message ||
              err.message ||
              'Error fetching user details'
          );
        }
      } catch (err) {
        setError('Error fetching user details');
        console.error('Error fetching user details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  const handleApproveUser = async () => {
    try {
      const response = await adminApi.approveUser(id || '0');
      if (response.status) {
        // Update the user state with the approved status
        setUser((prevUser) => {
          if (prevUser) {
            return { ...prevUser, is_approved: true };
          }
          return prevUser;
        });
        setShowApproveModal(false);
      } else {
        setError(response.message || 'Failed to approve user');
      }
    } catch (err) {
      setError('Error approving user');
      console.error('Error approving user:', err);
    }
  };

  const handleDeclineUser = async () => {
    try {
      const response = await adminApi.declineUser(id || '0');
      if (response.status) {
        // Update the user state with the declined status
        setUser((prevUser) => {
          if (prevUser) {
            return { ...prevUser, is_approved: false };
          }
          return prevUser;
        });
        setShowDeclineModal(false);
      } else {
        setError(response.message || 'Failed to decline user');
      }
    } catch (err) {
      setError('Error declining user');
      console.error('Error declining user:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-0">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-0">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error || 'User not found'}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    );
  }

  const userName = `${user.first_name} ${user.last_name}`;

  return (
    <div className="p-0">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Users</span>
        </button>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {userName}
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                User Profile Details
              </p>
            </div>
          </div>

          {/* Status Badge and Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                user.approval_status === 'approved'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : user.approval_status === 'pending'
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {user.approval_status === 'approved' ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : user.approval_status === 'pending' ? (
                <Clock className="w-3.5 h-3.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              {user.approval_status === 'approved'
                ? 'Approved'
                : user.approval_status === 'pending'
                  ? 'Pending Approval'
                  : 'Not Approved'}
            </span>

            {/* Only show approve/decline buttons for users with pending approval status */}
            {user.approval_status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <UserCheck className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => setShowDeclineModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <UserX className="w-4 h-4" />
                  Decline
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex flex-col items-center">
              {/* Avatar */}
              <div className="mb-4">
                <Avatar
                  src={user.avatar}
                  firstName={user.first_name}
                  lastName={user.last_name}
                  size="lg"
                  showStatus={true}
                  isOnline={user.is_verified === 1}
                />
              </div>

              {/* Name */}
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {userName}
              </h2>

              {/* User Type Badge */}
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
                <Briefcase className="w-4 h-4" />
                {userType
                  ? userType.charAt(0).toUpperCase() + userType.slice(1)
                  : 'User'}
              </div>

              {/* Verification Status */}
              <div className="w-full mb-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      user.is_verified === 1 ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    <Shield
                      className={`w-4 h-4 ${
                        user.is_verified === 1
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">
                      Verification Status
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        user.is_verified === 1
                          ? 'text-green-700'
                          : 'text-red-700'
                      }`}
                    >
                      {user.is_verified === 1 ? 'Verified' : 'Unverified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  User details and contact information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">
                    Title
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {user.title || 'N/A'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">
                    First Name
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {user.first_name}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">
                    Last Name
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {user.last_name}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">
                    Email
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 break-all">
                  {user.email}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">
                    Phone Number
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {user.phone || 'N/A'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">
                    Address
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 break-words">
                  {user.address || 'N/A'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">
                    Date of Birth
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {user.dob
                    ? format(new Date(user.dob), 'MMM dd, yyyy')
                    : 'Not provided'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">
                    Gender
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 capitalize">
                  {user.gender || 'Not specified'}
                </p>
              </div>

              {userType === 'employee' && (
                <div className="p-4 bg-gray-50 rounded-lg sm:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500">
                      Occupation
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {getUserOccupations(user)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showApproveModal && (
        <ApproveUserModal
          onClose={() => setShowApproveModal(false)}
          onApprove={handleApproveUser}
        />
      )}

      {showDeclineModal && (
        <DeclineUserModal
          onClose={() => setShowDeclineModal(false)}
          onDecline={handleDeclineUser}
        />
      )}
    </div>
  );
}
