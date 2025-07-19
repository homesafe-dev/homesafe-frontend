import { BsPeople } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../api/adminApi';

// Tab components
import DashboardEmployersTab from './tabs/dashboard/DashboardEmployersTab';
import DashboardAgentsTab from './tabs/dashboard/DashboardAgentsTab';
import DashboardEmployeesTab from './tabs/dashboard/DashboardEmployeesTab';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [employeeCount, setEmployeeCount] = useState(0);
  const [employerCount, setEmployerCount] = useState(0);
  const [terminatedCount, setTerminatedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('employers');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch employee data
        const employeeResponse = await adminApi.getEmployeeList(1, 100);
        console.log('Employee API Response:', employeeResponse); // Debug log

        if (employeeResponse.status) {
          // Handle new paginated response structure
          const employeeData =
            employeeResponse.data?.data || employeeResponse.data || [];
          setEmployeeCount(
            employeeResponse.data?.total || employeeData.length || 0
          );

          // Count terminated employees (this is just an example, adjust based on your API)
          const terminated =
            employeeData.filter((employee: any) => employee.status === 0)
              .length || 0;
          setTerminatedCount(terminated);
        }

        // Fetch employer data
        const employerResponse = await adminApi.getEmployerList(1, 100);
        console.log('Employer API Response:', employerResponse); // Debug log

        if (employerResponse.status) {
          // Handle new paginated response structure
          const employerData =
            employerResponse.data?.data || employerResponse.data || [];
          setEmployerCount(
            employerResponse.data?.total || employerData.length || 0
          );
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-end items-center mb-6 sm:mb-8">
        <button className="bg-[#EFAE73] h-[42px] text-[14px] sm:text-[16px] text-[#24292E] px-3 sm:px-4 py-2 w-[140px] sm:w-[165px] rounded-[59px]">
          Admin Dashboard
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 h-[160px] sm:h-[208px] flex items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center">
              <BsPeople className="text-gray-500" size={20} />
            </div>
            <div>
              <h2 className="text-[18px] sm:text-[20px] text-[#24292E] font-normal">
                {isLoading ? '...' : employeeCount}
              </h2>
              <p className="text-[#24292E] text-[14px] sm:text-[16px] leading-tight">
                Total Number of Users
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4 sm:p-6 h-[160px] sm:h-[208px] flex items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E8E9F5] rounded-full flex items-center justify-center">
              <BsPeople className="text-gray-500" size={20} />
            </div>
            <div>
              <h2 className="text-[18px] sm:text-[20px] text-[#24292E] font-normal">
                {isLoading ? '...' : employerCount}
              </h2>
              <p className="text-[#24292E] text-[14px] sm:text-[16px] leading-tight">
                Candidates on Placement
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4 sm:p-6 h-[160px] sm:h-[208px] flex items-center sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F5E8E9] rounded-full flex items-center justify-center">
              <BsPeople className="text-gray-500" size={20} />
            </div>
            <div>
              <h2 className="text-[18px] sm:text-[20px] text-[#24292E] font-normal">
                {isLoading ? '...' : terminatedCount}
              </h2>
              <p className="text-[#24292E] text-[14px] sm:text-[16px] leading-tight">
                Candidates terminated
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div>
            <h2 className="text-[#24292E] text-[18px] sm:text-[20px] font-semibold">
              Activities
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              View all candidates in the system
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/admin/all-candidates')}
              className="text-[#7B858E] hover:text-gray-900 font-semibold text-[12px] sm:text-[13px]"
            >
              View All
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 sm:px-6 mb-4">
          <div className="flex flex-wrap gap-2 sm:space-x-4 sm:gap-0">
            <button
              className={`py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded ${
                activeTab === 'employers'
                  ? 'bg-[#C8EDDF80] text-[#174B35]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('employers')}
            >
              Employers
            </button>
            <button
              className={`py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded ${
                activeTab === 'agents'
                  ? 'bg-[#C8EDDF80] text-[#174B35]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('agents')}
            >
              Agents
            </button>
            <button
              className={`py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded ${
                activeTab === 'employees'
                  ? 'bg-[#C8EDDF80] text-[#174B35]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('employees')}
            >
              Employees
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {activeTab === 'employers' && <DashboardEmployersTab />}
          {activeTab === 'agents' && <DashboardAgentsTab />}
          {activeTab === 'employees' && <DashboardEmployeesTab />}
        </div>
      </div>
    </div>
  );
}
