import { useEffect, useState } from 'react';
import { FaUser, FaPlus } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaRegUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../../api/adminApi';
import CreateUserModal from '../../../../components/CreateUserModal';

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

interface EmployeeListResponse {
  data: Employee[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export default function DashboardEmployeesTab() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOptionsFor, setShowOptionsFor] = useState<number | null>(null);

  // Helper function to safely format gender
  const formatGender = (gender: string | null): string => {
    if (!gender || typeof gender !== 'string') return 'N/A';
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  // Helper function to safely format name
  const formatName = (firstName: string | null, lastName: string | null): string => {
    const first = firstName || 'Unknown';
    const last = lastName || 'User';
    return `${first} ${last}`;
  };

  // Helper function to get employee status
  const getEmployeeStatus = (employee: Employee): { text: string; style: string } => {
    if (employee.is_verified === 1) {
      return { text: 'Verified', style: 'bg-green-100 text-green-800' };
    } else {
      return { text: 'Unverified', style: 'bg-red-100 text-red-800' };
    }
  };

  const toggleOptions = (id: number) => {
    if (showOptionsFor === id) {
      setShowOptionsFor(null);
    } else {
      setShowOptionsFor(id);
    }
  };

  const handleBlockUser = async (userId: number) => {
    try {
      const response = await adminApi.blockUser(userId);
      if (response.status) {
        alert('User blocked successfully');
        // Update the employee list to reflect the change
        setEmployees(employees.map(emp =>
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
    setShowOptionsFor(null);
  };

  const handleUnblockUser = async (userId: number) => {
    try {
      const response = await adminApi.unblockUser(userId);
      if (response.status) {
        alert('User unblocked successfully');
        // Update the employee list to reflect the change
        setEmployees(employees.map(emp =>
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
    setShowOptionsFor(null);
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
            <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
              Blocked Status
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
              Actions
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
              <td colSpan={8} className="px-6 py-4 text-center text-red-500">
                {error}
              </td>
            </tr>
          ) : employees.length === 0 ? (
            // Empty state
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
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
                          alt={formatName(employee.first_name, employee.last_name)}
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
                  {formatName(employee.first_name, employee.last_name)}
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
                  {formatGender(employee.gender)}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  {employee.phone || 'N/A'}
                </td>
                <td className="px-6 py-4">
                  {(() => {
                    const status = getEmployeeStatus(employee);
                    return (
                      <span className={`px-3 py-1 rounded-full text-[13px] ${status.style}`}>
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
                <td className="px-6 py-4 relative">
                  <button
                    onClick={() => toggleOptions(employee.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <BsThreeDotsVertical />
                  </button>
                  {showOptionsFor === employee.id && (
                    <div className="absolute right-8 top-10 bg-white shadow-lg rounded-md py-2 w-48 z-10">
                      <div
                        className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          navigate(`/admin/candidate-profile/${employee.id}`);
                          setShowOptionsFor(null);
                        }}
                      >
                        <FaRegUser className="text-gray-500" />
                        <span>View Profile</span>
                      </div>
                      {employee.is_blocked ? (
                        <div
                          className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleUnblockUser(employee.id)}
                        >
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                          </svg>
                          <span className="text-green-600">Unblock User</span>
                        </div>
                      ) : (
                        <div
                          className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleBlockUser(employee.id)}
                        >
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span className="text-red-600">Block User</span>
                        </div>
                      )}
                    </div>
                  )}
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
