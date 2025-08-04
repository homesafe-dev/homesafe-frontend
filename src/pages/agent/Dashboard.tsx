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
      <div className="flex justify-end items-center mb-6 sm:mb-8">
        {/* <h1 className="text-[16px] text-[#24292E]">Hello John</h1> */}
        <button className="bg-[#EFAE73] h-[36px] sm:h-[42px] text-[14px] sm:text-[16px] text-[#24292E] px-3 sm:px-4 py-2 w-[140px] sm:w-[165px] rounded-[59px]">
          <span className="hidden sm:inline">Ruby Subscription</span>
          <span className="sm:hidden">Ruby Sub</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 h-[160px] sm:h-[208px] flex items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center flex-shrink-0">
              <BsPeople className="text-gray-500" size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[18px] sm:text-[20px] text-[#24292E] font-normal">
                {isLoading ? '...' : employees.length}
              </h2>
              <p className="text-[#24292E] text-[14px] sm:text-[16px] leading-tight">
                Total Number of Candidates
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4 sm:p-6 h-[160px] sm:h-[208px] flex items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E8E9F5] rounded-full flex items-center justify-center flex-shrink-0">
              <BsPeople className="text-gray-500" size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[18px] sm:text-[20px] text-[#24292E] font-normal">
                {isLoading
                  ? '...'
                  : employees.filter(
                      (e) =>
                        e.placement &&
                        e.placement.toLowerCase() !== 'no employer assigned'
                    ).length}
              </h2>
              <p className="text-[#24292E] text-[14px] sm:text-[16px] leading-tight">
                Candidates on Placement
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4 sm:p-6 h-[160px] sm:h-[208px] flex items-center sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F5E8E9] rounded-full flex items-center justify-center flex-shrink-0">
              <BsPeople className="text-gray-500" size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[18px] sm:text-[20px] text-[#24292E] font-normal">
                {isLoading
                  ? '...'
                  : employees.filter(
                      (e) => e.status && e.status.toLowerCase() === 'terminated'
                    ).length}
              </h2>
              <p className="text-[#24292E] text-[14px] sm:text-[16px] leading-tight">
                Candidates terminated
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <div className="">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h2 className="text-[#24292E] text-[18px] sm:text-[20px] font-semibold">
            Candidates
          </h2>
          <button
            onClick={() => navigate('/agent/all-candidates')}
            className="text-[#7B858E] hover:text-gray-900 font-semibold text-[12px] sm:text-[13px] self-start sm:self-auto"
          >
            View All
          </button>
        </div>

        <div
          className="overflow-x-auto overflow-y-visible"
          style={{ marginLeft: '-1rem', marginRight: '-1rem' }}
        >
          <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
            <table className="w-full" style={{ minWidth: '700px' }}>
              <thead className="bg-[#C8EDDF80] h-[56px] text-left">
                <tr>
                  <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal whitespace-nowrap">
                    New Candidate
                  </th>
                  <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal whitespace-nowrap">
                    Date
                  </th>
                  <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal whitespace-nowrap">
                    Placement
                  </th>
                  <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal whitespace-nowrap">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal whitespace-nowrap">
                    Phone Number
                  </th>
                  <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal whitespace-nowrap">
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
                      <td className="px-6 py-4 flex items-center gap-2 text-[13px] text-[#24292E] font-normal whitespace-nowrap">
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
                      <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal whitespace-nowrap">
                        {new Date(employee.date).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-[13px] font-normal whitespace-nowrap">
                        <span
                          className={`${
                            employee.placement && employee.placement.toLowerCase() ===
                            'no employer assigned'
                              ? 'text-gray-500 italic'
                              : 'text-[#24292E]'
                          }`}
                        >
                          {employee.placement && employee.placement.toLowerCase() ===
                          'no employer assigned'
                            ? 'Not on placement'
                            : employee.placement || 'Not assigned'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal whitespace-nowrap">
                        {employee.gender
                          ? employee.gender.charAt(0).toUpperCase() + employee.gender.slice(1)
                          : 'Not specified'}
                      </td>
                      <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal whitespace-nowrap">
                        {employee.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-[13px] ${
                            employee.status && (employee.status.toLowerCase().includes('not') ||
                            employee.status.toLowerCase() === 'unverified')
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {employee.status && employee.status.toLowerCase().includes('not')
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
    </div>
  );
}
