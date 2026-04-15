import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import adminApi from '../../../../api/adminApi';
import CreateUserModal from '../../../../components/CreateUserModal';
import Avatar from '../../../../components/common/Avatar';

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

export default function DashboardAgentsTab() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
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
    };

    fetchAgents();
  }, []);

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Agents</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Create New Agent
        </button>
      </div>

      <table className="w-full">
        <thead className="bg-[#C8EDDF80] dark:bg-gray-800 h-[56px] text-left border-b border-transparent dark:border-gray-700">
          <tr>
            <th className="px-6 py-3 text-[13px] text-[#174B35] dark:text-gray-200 font-normal">
              Full Name
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] dark:text-gray-200 font-normal">
              Email
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] dark:text-gray-200 font-normal">
              Location
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] dark:text-gray-200 font-normal">
              Total Employees
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] dark:text-gray-200 font-normal">
              Phone Number
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] dark:text-gray-200 font-normal">
              Status
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] dark:text-gray-200 font-normal">
              Blocked Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {isLoading ? (
            // Loading state - show skeleton rows
            [...Array(3)].map((_, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 animate-pulse">
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
          ) : agents.length === 0 ? (
            // Empty state
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                No agents found
              </td>
            </tr>
          ) : (
            // Data loaded successfully
            agents.map((agent) => (
              <tr
                key={agent.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => navigate(`/admin/user/${agent.id}`)}
              >
                <td className="px-6 py-4 flex items-center gap-2 text-[13px] text-[#24292E] dark:text-gray-200 font-normal">
                  <Avatar
                    src={agent.avatar}
                    firstName={agent.first_name}
                    lastName={agent.last_name}
                    size="sm"
                    showStatus={false}
                  />
                  {`${agent.first_name} ${agent.last_name}`}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] dark:text-gray-200 font-normal">
                  {agent.email || 'N/A'}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] dark:text-gray-200 font-normal">
                  {agent.address ? agent.address.split(',')[0] : 'Lagos'}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] dark:text-gray-200 font-normal">
                  {agent.total_employees !== undefined
                    ? agent.total_employees
                    : 'N/A'}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] dark:text-gray-200 font-normal">
                  {agent.phone || 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[13px] ${
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
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[13px] ${
                      agent.is_blocked
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {agent.is_blocked ? 'Blocked' : 'Active'}
                  </span>
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
          window.location.reload();
        }}
      />
    </div>
  );
}
