import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import DropdownMenu from '../../../components/common/DropdownMenu';
import ApproveUserModal from '../../../components/admin/ApproveUserModal';
import DeclineUserModal from '../../../components/admin/DeclineUserModal';
import Avatar from '../../../components/common/Avatar';

interface User {
  id: number;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  username: string | null;
  email: string;
  email_verified_at: string | null;
  avatar: string | null;
  gender: string | null;
  dob: string | null;
  phone: string | null;
  address: string | null;
  status: number;
  is_verified: number;
  salary: string;
  profile_description: string | null;
  created_at: string;
  updated_at: string;
}

export default function IncomingRequestsTab() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const fetchUnapprovedUsers = async () => {
    try {
      setIsLoading(true);
      // Use a larger limit to ensure we get all unapproved users
      const response = await adminApi.getUnapprovedUsers(1, 100);
      if (response.status) {
        // The users array is in response.data.data
        setUsers(response.data.data || []);
      } else {
        setError(response.message || 'Failed to fetch incoming requests');
      }
    } catch (err) {
      setError('Error fetching incoming requests');
      console.error('Error fetching incoming requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnapprovedUsers();
  }, []);

  const handleApproveUser = async () => {
    if (!selectedUserId) return;

    try {
      const response = await adminApi.approveUser(selectedUserId.toString());
      if (response.status) {
        // Refresh the list after approval
        fetchUnapprovedUsers();
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
    if (!selectedUserId) return;

    try {
      const response = await adminApi.declineUser(selectedUserId.toString());
      if (response.status) {
        // Refresh the list after declining
        fetchUnapprovedUsers();
        setShowDeclineModal(false);
      } else {
        setError(response.message || 'Failed to decline user');
      }
    } catch (err) {
      setError('Error declining user');
      console.error('Error declining user:', err);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#C8EDDF80] h-[56px] text-left">
          <tr>
            <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
              Full Name
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
              Date
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
              Location
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
              Gender
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
              Phone Number
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
              Status
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {isLoading ? (
            // Loading state - show skeleton rows
            [...Array(3)].map((_, index) => (
              <tr key={index} className="hover:bg-gray-50 animate-pulse">
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 rounded"></div>
                </td>
              </tr>
            ))
          ) : error ? (
            // Error state
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-red-500">
                {error}
              </td>
            </tr>
          ) : users.length === 0 ? (
            // Empty state
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                No incoming requests found
              </td>
            </tr>
          ) : (
            // Data loaded successfully
            users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-2 text-[13px] text-[#24292E] font-normal">
                  <Avatar
                    src={user.avatar}
                    firstName={user.first_name || ''}
                    lastName={user.last_name || ''}
                    size="sm"
                  />
                  {user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user.email
                  }
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  {user.address ? user.address.split(',')[0] : 'Lagos'}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  {user.gender
                    ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                    : 'Not specified'
                  }
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  {user.phone || 'Not provided'}
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-[13px] bg-red-100 text-red-800">
                    Unverified
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu
                    options={[
                      {
                        label: 'View Details',
                        onClick: () => navigate(`/admin/user/${user.id}`),
                      },
                      {
                        label: 'Approve',
                        onClick: () => {
                          setSelectedUserId(user.id);
                          setShowApproveModal(true);
                        },
                      },
                      {
                        label: 'Decline',
                        onClick: () => {
                          setSelectedUserId(user.id);
                          setShowDeclineModal(true);
                        },
                      },
                    ]}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Approve User Modal */}
      {showApproveModal && (
        <ApproveUserModal
          onClose={() => setShowApproveModal(false)}
          onApprove={handleApproveUser}
        />
      )}

      {/* Decline User Modal */}
      {showDeclineModal && (
        <DeclineUserModal
          onClose={() => setShowDeclineModal(false)}
          onDecline={handleDeclineUser}
        />
      )}
    </div>
  );
}
