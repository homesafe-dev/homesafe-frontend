import { useEffect, useState } from 'react';
import { FaUser, FaPlus } from 'react-icons/fa';
import adminApi from '../../../../api/adminApi';
import CreateUserModal from '../../../../components/CreateUserModal';

interface Employee {
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
  employer?: {
    id: number;
    name: string;
  };
}

interface EmployeeListResponse {
  data: Employee[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export default function DashboardEmployeesTab() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
        <h2 className="text-xl font-semibold">Employees</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Create New Employee
        </button>
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
              <td colSpan={6} className="px-6 py-4 text-center text-red-500">
                {error}
              </td>
            </tr>
          ) : employees.length === 0 ? (
            // Empty state
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                No employees found
              </td>
            </tr>
          ) : (
            // Data loaded successfully
            employees.map((employee) => (
              <tr
                key={employee.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/admin/user/${employee.id}`)}
              >
                <td className="px-6 py-4 flex items-center gap-2 text-[13px] text-[#24292E] font-normal">
                  <div className="flex items-center gap-2 relative">
                    {employee.avatar ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden relative">
                        <img
                          src={employee.avatar}
                          alt={`${employee.first_name} ${employee.last_name}`}
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
                  {`${employee.first_name} ${employee.last_name}`}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  {new Date(employee.created_at).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  {employee.employer
                    ? employee.employer.name
                    : 'No employer assigned'}
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
                      employee.is_verified === 0
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {employee.is_verified === 0 ? 'Unverified' : 'Verified'}
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
