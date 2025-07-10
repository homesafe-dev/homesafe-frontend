import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import adminApi from '../../api/adminApi';
import ApproveUserModal from '../../components/admin/ApproveUserModal';
import DeclineUserModal from '../../components/admin/DeclineUserModal';

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
  const [userType, setUserType] = useState<'employee' | 'employer' | 'agent' | null>(null);

  // Helper function to get user's occupations
  const getUserOccupations = (user: UserDetails): string => {
    if (user.occupations && user.occupations.length > 0) {
      return user.occupations.map(occ => occ.name.charAt(0).toUpperCase() + occ.name.slice(1)).join(', ');
    }
    return 'No occupation';
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        // Since there's no single user API, we'll try to find the user in all lists

        // Try to find in employees list
        const employeeResponse = await adminApi.getEmployeeList(1, 100); // Use larger limit
        if (employeeResponse.status) {
          // Check if data is an array or has a data property
          const employeeList = Array.isArray(employeeResponse.data.data)
            ? employeeResponse.data.data
            : Array.isArray(employeeResponse.data)
              ? employeeResponse.data
              : [];

          const employeeData = employeeList.find(
            (user: any) => user.id === parseInt(id || '0')
          );
          if (employeeData) {
            setUser(employeeData);
            setUserType('employee');
            setLoading(false);
            return;
          }
        }

        // Try to find in employers list
        const employerResponse = await adminApi.getEmployerList(1, 100); // Use larger limit
        if (employerResponse.status) {
          // Check if data is an array or has a data property
          const employerList = Array.isArray(employerResponse.data)
            ? employerResponse.data
            : employerResponse.data.data || [];

          const employerData = employerList.find(
            (user: any) => user.id === parseInt(id || '0')
          );
          if (employerData) {
            setUser(employerData);
            setUserType('employer');
            setLoading(false);
            return;
          }
        }

        // Try to find in agents list
        const agentResponse = await adminApi.getAgentList(1, 100); // Use larger limit
        if (agentResponse.status) {
          // Check if data is an array or has a data property
          const agentList = Array.isArray(agentResponse.data)
            ? agentResponse.data
            : agentResponse.data.data || [];

          const agentData = agentList.find(
            (user: any) => user.id === parseInt(id || '0')
          );
          if (agentData) {
            setUser(agentData);
            setUserType('agent');
            setLoading(false);
            return;
          }
        }

        // If we get here, user was not found in any list
        setError('User not found');
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'User not found'}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          {/* User Status Indicator */}
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.approval_status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : user.approval_status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {user.approval_status === 'approved'
                  ? 'Approved'
                  : user.approval_status === 'pending'
                    ? 'Pending Approval'
                    : 'Not Approved'}
              </span>
            </div>
          )}
        </div>
        {/* Only show approve/decline buttons for users with pending approval status */}
        {user && user.approval_status === 'pending' && (
          <div className="flex space-x-4">
            <button
              onClick={() => setShowApproveModal(true)}
              className="bg-[#C8EDDF80] text-[#174B35] px-4 py-2 rounded-md hover:bg-[#C8EDDF] transition-colors"
            >
              Approve User
            </button>
            <button
              onClick={() => setShowDeclineModal(true)}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              Decline User
            </button>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Title</h3>
              <p className="mt-1 text-sm text-gray-900">{user.title || 'Mr'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">First Name</h3>
              <p className="mt-1 text-sm text-gray-900">{user.first_name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
              <p className="mt-1 text-sm text-gray-900">{user.last_name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-sm text-gray-900">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Phone Number
              </h3>
              <p className="mt-1 text-sm text-gray-900">{user.phone}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Home Address
              </h3>
              <p className="mt-1 text-sm text-gray-900">{user.address}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Date of Birth
              </h3>
              <p className="mt-1 text-sm text-gray-900">
                {user.dob ? new Date(user.dob).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                }) : 'Not provided'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Gender</h3>
              <p className="mt-1 text-sm text-gray-900 capitalize">{user.gender || 'Not specified'}</p>
            </div>

            {userType === 'employee' && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Occupation</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {getUserOccupations(user)}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500">Verification Status</h3>
              <p className="mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.is_verified === 1
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.is_verified === 1 ? 'Verified' : 'Unverified'}
                </span>
              </p>
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
