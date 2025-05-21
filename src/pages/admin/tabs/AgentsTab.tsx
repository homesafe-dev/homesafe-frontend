import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import DropdownMenu from '../../../components/common/DropdownMenu';

interface Agent {
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
  salary: string;
  profile_description: string | null;
  created_at: string;
  updated_at: string;
}

export default function AgentsTab() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setIsLoading(true);
        // Use a larger limit to ensure we get all agents
        const response = await adminApi.getAgentList(1, 100);
        if (response.status) {
          // The agents array is in response.data.data
          setAgents(response.data.data || []);

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
            <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">

            </th>
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
          ) : agents.length === 0 ? (
            // Empty state
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                No agents found
              </td>
            </tr>
          ) : (
            // Data loaded successfully
            agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-2 text-[13px] text-[#24292E] font-normal">
                  <div className="flex items-center gap-2 relative">
                    {agent.avatar ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden relative">
                        <img
                          src={agent.avatar}
                          alt={`${agent.first_name} ${agent.last_name}`}
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
                  {`${agent.first_name} ${agent.last_name}`}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  {new Date(agent.created_at).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  {agent.address ? agent.address.split(',')[0] : 'Lagos'}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  {agent.gender.charAt(0).toUpperCase() +
                    agent.gender.slice(1)}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  {agent.phone}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[13px] ${
                      agent.is_verified === 0
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {agent.is_verified === 0 ? 'Unverified' : 'Verified'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu
                    options={[
                      {
                        label: 'View Details',
                        onClick: () => navigate(`/admin/user/${agent.id}`),
                      },
                    ]}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
