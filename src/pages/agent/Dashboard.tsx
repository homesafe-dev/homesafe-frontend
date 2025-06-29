import { BsPeople } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import agentApi from '../../api/agentApi';

interface Employee {
  id: number;
  candidate: string;
  title: string;
  email: string;
  avatar: string;
  date: string;
  placement: string;
  gender: string;
  phone: string;
  status: string;
}

export default function AgentDashboard() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const response = await agentApi.getTrackedEmployees();
        if (response.status) {
          setEmployees(response.data);
        } else {
          setError(response.message || 'Failed to fetch employees');
        }
      } catch (err) {
        setError('Error fetching employees');
        console.error('Error fetching employees:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);
  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-end items-center mb-8">
        {/* <h1 className="text-[16px] text-[#24292E]">Hello John</h1> */}
        <button className="bg-[#EFAE73] h-[42px] text-[16px] text-[#24292E] px-4 py-2 w-[165px] rounded-[59px]">
          Ruby Subscription
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6 h-[208px] flex items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center">
              <BsPeople className="text-gray-500" size={24} />
            </div>
            <div>
              <h2 className="text-[20px] text-[#24292E] font-normal">
                {isLoading ? '...' : employees.length}
              </h2>
              <p className="text-[#24292E] text-[16px]">
                Total Number of Candidates
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 h-[208px] flex items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#E8E9F5] rounded-full flex items-center justify-center">
              <BsPeople className="text-gray-500" size={24} />
            </div>
            <div>
              <h2 className="text-[20px] text-[#24292E] font-normal">
                {isLoading
                  ? '...'
                  : employees.filter(
                      (e) =>
                        e.placement &&
                        e.placement.toLowerCase() !== 'no employer assigned'
                    ).length}
              </h2>
              <p className="text-[#24292E] text-[16px]">
                Candidates on Placement
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 h-[208px] flex items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F5E8E9] rounded-full flex items-center justify-center">
              <BsPeople className="text-gray-500" size={24} />
            </div>
            <div>
              <h2 className="text-[20px] text-[#24292E] font-normal">
                {isLoading
                  ? '...'
                  : employees.filter(
                      (e) => e.status.toLowerCase() === 'terminated'
                    ).length}
              </h2>
              <p className="text-[#24292E] text-[16px]">
                Candidates terminated
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <div className="">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-[#24292E] text-[20px] font-semibold">
            Candidates
          </h2>
          <button
            onClick={() => navigate('/agent/all-candidates')}
            className="text-[#7B858E] hover:text-gray-900 font-semibold text-[13px]"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#C8EDDF80] h-[56px] text-left">
              <tr>
                <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
                  New Candidate
                </th>
                <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
                  Date
                </th>
                <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
                  Placement
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
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                // Empty state
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No employees found
                  </td>
                </tr>
              ) : (
                // Data loaded successfully
                employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-2 text-[13px] text-[#24292E] font-normal">
                      <div className="flex items-center gap-2 relative">
                        {employee.avatar ? (
                          <div className="w-8 h-8 rounded-full overflow-hidden relative">
                            <img
                              src={employee.avatar}
                              alt={employee.candidate}
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
                      {employee.candidate}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                      {new Date(employee.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-[13px] font-normal">
                      <span
                        className={`${
                          employee.placement.toLowerCase() ===
                          'no employer assigned'
                            ? 'text-gray-500 italic'
                            : 'text-[#24292E]'
                        }`}
                      >
                        {employee.placement.toLowerCase() ===
                        'no employer assigned'
                          ? 'Not on placement'
                          : employee.placement}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                      {employee.gender.charAt(0).toUpperCase() +
                        employee.gender.slice(1)}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                      {employee.phone}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[13px] ${
                          employee.status.toLowerCase().includes('not') ||
                          employee.status.toLowerCase() === 'unverified'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {employee.status.toLowerCase().includes('not')
                          ? 'Unverified'
                          : 'Verified'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
