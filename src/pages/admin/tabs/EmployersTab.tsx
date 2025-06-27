import { useEffect, useState } from 'react';
import { FaUser, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import DropdownMenu from '../../../components/common/DropdownMenu';
import CreateUserModal from '../../../components/CreateUserModal';

interface Employer {
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
  is_blocked: boolean;
  salary: string;
  profile_description: string | null;
  created_at: string;
  updated_at: string;
}

export default function EmployersTab() {
  const navigate = useNavigate();
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleBlockUser = async (userId: number) => {
    try {
      const response = await adminApi.blockUser(userId);
      if (response.status) {
        alert('User blocked successfully');
        // Update the employer list to reflect the change
        setEmployers(employers.map(emp =>
          emp.id === userId
            ? { ...emp, is_blocked: true }
            : emp
        ));
      } else {
        alert(response.message || 'Failed to block user');
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      alert('An error occurred while blocking the user');
    }
  };

  const handleUnblockUser = async (userId: number) => {
    try {
      const response = await adminApi.unblockUser(userId);
      if (response.status) {
        alert('User unblocked successfully');
        // Update the employer list to reflect the change
        setEmployers(employers.map(emp =>
          emp.id === userId
            ? { ...emp, is_blocked: false }
            : emp
        ));
      } else {
        alert(response.message || 'Failed to unblock user');
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      alert('An error occurred while unblocking the user');
    }
  };

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use a larger limit to ensure we get all employers
        const response = await adminApi.getEmployerList(1, 100);
        console.log('Employers API Response:', response); // Debug log

        if (response.status) {
          // Handle the new paginated response structure
          const employerData = response.data?.data || response.data || [];
          console.log('Extracted employer data:', employerData); // Debug log
          setEmployers(employerData);
        } else {
          setError(response.message || 'Failed to fetch employers');
        }
      } catch (err) {
        setError('Error fetching employers');
        console.error('Error fetching employers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployers();
  }, []);

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Employers</h2>

      </div>

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
          ) : employers.length === 0 ? (
            // Empty state
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                No employers found
              </td>
            </tr>
          ) : (
            // Data loaded successfully
            employers.map((employer) => (
              <tr key={employer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-2 text-[13px] text-[#24292E] font-normal">
                  <div className="flex items-center gap-2 relative">
                    {employer.avatar ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden relative">
                        <img
                          src={employer.avatar}
                          alt={`${employer.first_name} ${employer.last_name}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute w-3 h-3 bg-green-500 rounded-full -top-1 -right-1 border-2 border-white" />
                      </div>
                    ) : (
                      <div className="bg-[#BDBDBD] rounded-full p-2 flex items-center justify-center relative">
                        <FaUser className="text-white" />
                        <div className="absolute w-3 h-3 bg-green-500 rounded-full -top-1 -right-1 border-2 border-white" />
                      </div>
                    )}
                  </div>
                  {`${employer.first_name} ${employer.last_name}`}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  {new Date(employer.created_at).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  {employer.address ? employer.address.split(',')[0] : 'Lagos'}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  {employer.gender.charAt(0).toUpperCase() +
                    employer.gender.slice(1)}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  {employer.phone}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[13px] ${
                      employer.is_verified === 0
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {employer.is_verified === 0 ? 'Unverified' : 'Verified'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu
                    options={[
                      {
                        label: 'View Details',
                        onClick: () => navigate(`/admin/user/${employer.id}`),
                      },
                      {
                        label: employer.is_blocked ? 'Unblock User' : 'Block User',
                        onClick: () => employer.is_blocked
                          ? handleUnblockUser(employer.id)
                          : handleBlockUser(employer.id),
                      },
                    ]}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        userType="employer"
        onSuccess={() => {
          // Refresh the employers list
          window.location.reload();
        }}
      />
    </div>
  );
}
