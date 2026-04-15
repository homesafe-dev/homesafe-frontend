import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../../api/adminApi';
import CreateUserModal from '../../../../components/CreateUserModal';
import Avatar from '../../../../components/common/Avatar';

interface Employee {
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
  approval_status: string;
  is_blocked: boolean;
  salary: string | null;
  profile_description: string | null;
  created_at: string;
  updated_at: string;
  employer?: {
    id: number;
    name: string;
  };
}

// interface EmployeeListResponse {
//   data: Employee[];
//   total: number;
//   per_page: number;
//   current_page: number;
//   last_page: number;
// }

export default function DashboardEmployeesTab() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  // Helper function to safely format gender
  const formatGender = (gender: string | null): string => {
    if (!gender || typeof gender !== 'string') return 'N/A';
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  // Helper function to safely format name
  const formatName = (
    firstName: string | null,
    lastName: string | null
  ): string => {
    const first = firstName || 'Unknown';
    const last = lastName || 'User';
    return `${first} ${last}`;
  };

  // Helper function to get employee status
  const getEmployeeStatus = (
    employee: Employee
  ): { text: string; style: string } => {
    if (employee.is_verified === 1) {
      return { text: 'Verified', style: 'bg-green-100 text-green-800' };
    } else {
      return { text: 'Unverified', style: 'bg-red-100 text-red-800' };
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use a smaller limit for the dashboard preview
        const response = await adminApi.getEmployeeList(1, 5);
        console.log('Dashboard Employees API Response:', response); // Debug log

        if (response.status) {
          // Handle the new paginated response structure
          const employeeData = response.data?.data || response.data || [];
          console.log('Extracted dashboard employee data:', employeeData); // Debug log
          setEmployees(employeeData);
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
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Employees</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Create New Employee
        </button>
      </div>

      <table className="w-full">
        <thead className="bg-[#C8EDDF80] dark:bg-gray-800 h-[56px] text-left border-b border-transparent dark:border-gray-700">
          <tr>
            <th className="px-6 py-3 text-[13px] text-[#174B35] dark:text-gray-200 font-normal">
              Full Name
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] dark:text-gray-200 font-normal">
              Date
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] dark:text-gray-200 font-normal">
              Placement
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] dark:text-gray-200 font-normal">
              Gender
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
          ) : employees.length === 0 ? (
            // Empty state
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                No employees found
              </td>
            </tr>
          ) : (
            // Data loaded successfully
            employees.map((employee) => (
              <tr
                key={employee.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => navigate(`/admin/user/${employee.id}`)}
              >
                <td className="px-6 py-4 flex items-center gap-2 text-[13px] text-[#24292E] dark:text-gray-200 font-normal">
                  <Avatar
                    src={employee.avatar}
                    firstName={employee.first_name || 'Unknown'}
                    lastName={employee.last_name || 'User'}
                    size="sm"
                    showStatus={false}
                  />
                  {formatName(employee.first_name, employee.last_name)}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] dark:text-gray-200 font-normal">
                  {new Date(employee.created_at).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] dark:text-gray-200 font-normal">
                  {employee.employer
                    ? employee.employer.name
                    : 'No employer assigned'}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] dark:text-gray-200 font-normal">
                  {formatGender(employee.gender)}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] dark:text-gray-200 font-normal">
                  {employee.phone || 'N/A'}
                </td>
                <td className="px-6 py-4">
                  {(() => {
                    const status = getEmployeeStatus(employee);
                    return (
                      <span
                        className={`px-3 py-1 rounded-full text-[13px] ${status.style}`}
                      >
                        {status.text}
                      </span>
                    );
                  })()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[13px] ${
                      employee.is_blocked
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {employee.is_blocked ? 'Blocked' : 'Active'}
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
        userType="employee"
        onSuccess={() => {
          // Refresh the employees list
          window.location.reload();
        }}
      />
    </div>
  );
}
