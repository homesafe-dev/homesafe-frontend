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
      <div className="flex justify-end items-center mb-8">
        <button className="bg-[#EFAE73] h-[42px] text-[16px] text-[#24292E] px-4 py-2 w-[165px] rounded-[59px]">
          Admin Dashboard
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
                {isLoading ? '...' : employeeCount}
              </h2>
              <p className="text-[#24292E] text-[16px]">
                Total Number of Users
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
                {isLoading ? '...' : employerCount}
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
                {isLoading ? '...' : terminatedCount}
              </h2>
              <p className="text-[#24292E] text-[16px]">
                Candidates terminated
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 flex justify-between items-center">
          <div>
            <h2 className="text-[#24292E] text-[20px] font-semibold">
              Activities
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              View all candidates in the system
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/admin/all-candidates')}
              className="text-[#7B858E] hover:text-gray-900 font-semibold text-[13px]"
            >
              View All
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 mb-4">
          <div className="flex space-x-4">
            <button
              className={`py-2 px-4 text-sm font-medium rounded ${
                activeTab === 'employers'
                  ? 'bg-[#C8EDDF80] text-[#174B35]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('employers')}
            >
              Employers
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium rounded ${
                activeTab === 'agents'
                  ? 'bg-[#C8EDDF80] text-[#174B35]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('agents')}
            >
              Agents
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium rounded ${
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
        <div className="p-6">
          {activeTab === 'employers' && <DashboardEmployersTab />}
          {activeTab === 'agents' && <DashboardAgentsTab />}
          {activeTab === 'employees' && <DashboardEmployeesTab />}
        </div>
      </div>
    </div>
  );
}
