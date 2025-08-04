import { useEffect, useState, useCallback } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import DropdownMenu from '../../../components/common/DropdownMenu';
import CreateUserModal from '../../../components/CreateUserModal';
import Avatar from '../../../components/common/Avatar';
import Toast from '../../../components/common/Toast';

interface Agent {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string;
  status: string;
  total_employees: number;
  average_rating: number | null;
  total_reviews: number;
  // Optional fields that might be in different API responses
  gender?: string;
  address?: string;
  created_at?: string;
  is_verified?: number;
  is_blocked?: boolean;
}

export default function AgentsTab() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  const handleBlockUser = async (userId: number) => {
    try {
      const response = await adminApi.blockUser(userId);
      if (response.status) {
        showToast('User blocked successfully', 'success');
        // Update the agent list to reflect the change
        setAgents(
          agents.map((agent) =>
            agent.id === userId ? { ...agent, is_blocked: true } : agent
          )
        );
      } else {
        showToast(response.message || 'Failed to block user', 'error');
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      showToast('An error occurred while blocking the user', 'error');
    }
  };

  const handleUnblockUser = async (userId: number) => {
    try {
      const response = await adminApi.unblockUser(userId);
      if (response.status) {
        showToast('User unblocked successfully', 'success');
        // Update the agent list to reflect the change
        setAgents(
          agents.map((agent) =>
            agent.id === userId ? { ...agent, is_blocked: false } : agent
          )
        );
      } else {
        showToast(response.message || 'Failed to unblock user', 'error');
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      showToast('An error occurred while unblocking the user', 'error');
    }
  };

  // Memoize fetchAgents
  const fetchAgents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Use a smaller limit for the dashboard preview
      const response = await adminApi.getAgentList(1, 5);
      console.log('Dashboard Agents API Response:', response); // Debug log

      if (response.status) {
        // Handle the new paginated response structure
        const agentData = response.data?.data || response.data || [];
        console.log('Extracted dashboard agent data:', agentData); // Debug log
        setAgents(agentData);
      } else {
        setError(response.message || 'Failed to fetch agents');
      }
    } catch (err) {
      setError('Error fetching agents');
      console.error('Error fetching agents:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-semibold">Agents</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-md flex items-center text-sm sm:text-base"
        >
          <FaPlus className="mr-1 sm:mr-2" size={14} /> Create New Agent
        </button>
      </div>

      <table className="w-full min-w-[900px]">
        <thead className="bg-[#C8EDDF80] h-[48px] sm:h-[56px] text-left">
          <tr>
            <th className="px-3 sm:px-6 py-3 text-[11px] sm:text-[13px] text-[#174B35] font-normal">
              Full Name
            </th>
            <th className="px-3 sm:px-6 py-3 text-[11px] sm:text-[13px] text-[#174B35] font-normal">
              Email
            </th>
            <th className="px-3 sm:px-6 py-3 text-[11px] sm:text-[13px] text-[#174B35] font-normal">
              Location
            </th>
            <th className="px-3 sm:px-6 py-3 text-[11px] sm:text-[13px] text-[#174B35] font-normal">
              Total Employees
            </th>
            <th className="px-3 sm:px-6 py-3 text-[11px] sm:text-[13px] text-[#174B35] font-normal">
              Phone Number
            </th>
            <th className="px-3 sm:px-6 py-3 text-[11px] sm:text-[13px] text-[#174B35] font-normal">
              Status
            </th>
            <th className="px-3 sm:px-6 py-3 text-[11px] sm:text-[13px] text-[#174B35] font-normal">
              Blocked Status
            </th>
            <th className="px-3 sm:px-6 py-3 text-[11px] sm:text-[13px] text-[#174B35] font-normal"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {isLoading ? (
            // Loading state - show skeleton rows
            [...Array(3)].map((_, index) => (
              <tr key={index} className="hover:bg-gray-50 animate-pulse">
                <td className="px-3 sm:px-6 py-3 sm:py-4">
                  <div className="h-6 sm:h-8 bg-gray-200 rounded"></div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4">
                  <div className="h-6 sm:h-8 bg-gray-200 rounded"></div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4">
                  <div className="h-6 sm:h-8 bg-gray-200 rounded"></div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4">
                  <div className="h-6 sm:h-8 bg-gray-200 rounded"></div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4">
                  <div className="h-6 sm:h-8 bg-gray-200 rounded"></div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4">
                  <div className="h-6 sm:h-8 bg-gray-200 rounded"></div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4">
                  <div className="h-6 sm:h-8 bg-gray-200 rounded"></div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4">
                  <div className="h-6 sm:h-8 bg-gray-200 rounded"></div>
                </td>
              </tr>
            ))
          ) : error ? (
            // Error state
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center text-red-500">
                {error}
              </td>
            </tr>
          ) : agents.length === 0 ? (
            // Empty state
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                No agents found
              </td>
            </tr>
          ) : (
            // Data loaded successfully
            agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-gray-50">
                <td className="px-3 sm:px-6 py-3 sm:py-4 flex items-center gap-2 text-[11px] sm:text-[13px] text-[#24292E] font-normal">
                  <Avatar
                    src={agent.avatar}
                    firstName={agent.first_name}
                    lastName={agent.last_name}
                    size="sm"
                    showStatus={false}
                  />
                  <span className="truncate">{`${agent.first_name} ${agent.last_name}`}</span>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-[11px] sm:text-[13px] text-[#24292E] font-normal">
                  <span className="truncate">{agent.email || 'N/A'}</span>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-[11px] sm:text-[13px] text-[#24292E] font-normal">
                  <span className="truncate">
                    {agent.address ? agent.address.split(',')[0] : 'Lagos'}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-[11px] sm:text-[13px] text-[#24292E] font-normal">
                  {agent.total_employees !== undefined
                    ? agent.total_employees
                    : 'N/A'}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-[11px] sm:text-[13px] text-[#24292E] font-normal">
                  <span className="truncate">{agent.phone || 'N/A'}</span>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-[13px] ${
                      agent.status === 'not verified'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {agent.status === 'not verified'
                      ? 'Unverified'
                      : 'Verified'}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-[13px] ${
                      agent.is_blocked
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {agent.is_blocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                  <DropdownMenu
                    options={[
                      {
                        label: 'View Details',
                        onClick: () => navigate(`/admin/user/${agent.id}`),
                      },
                      {
                        label: agent.is_blocked ? 'Unblock User' : 'Block User',
                        onClick: () =>
                          agent.is_blocked
                            ? handleUnblockUser(agent.id)
                            : handleBlockUser(agent.id),
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
        userType="agent"
        onSuccess={() => {
          // Refresh the agents list
          fetchAgents();
        }}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
