import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import DropdownMenu from '../../../components/common/DropdownMenu';
import Avatar from '../../../components/common/Avatar';
import Toast from '../../../components/common/Toast';

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
  is_blocked: boolean;
  salary: string;
  profile_description: string | null;
  created_at: string;
  updated_at: string;
  average_rating: number | null;
  occupations: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    pivot: {
      user_id: number;
      occupation_id: number;
    };
  }[];
}

interface EmployeeListResponse {
  current_page: number;
  data: Employee[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export default function EmployeesTab() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        // Update the employee list to reflect the change
        setEmployees(
          employees.map((emp) =>
            emp.id === userId ? { ...emp, is_blocked: true } : emp
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
        // Update the employee list to reflect the change
        setEmployees(
          employees.map((emp) =>
            emp.id === userId ? { ...emp, is_blocked: false } : emp
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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        // Use a larger limit to ensure we get all employees
        const response = await adminApi.getEmployeeList(1, 100);
        if (response.status) {
          const employeeData = response.data as EmployeeListResponse;
          setEmployees(employeeData.data);
        } else {
          const errorMessage = response.message || 'Failed to fetch employees';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        }
      } catch (err) {
        const errorMessage = 'Error fetching employees';
        setError(errorMessage);
        showToast(errorMessage, 'error');
        console.error('Error fetching employees:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="overflow-x-auto">
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
            <th className="px-6 py-3 text-[13px] text-[#174B35] dark:text-gray-200 font-normal"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
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
          ) : employees.length === 0 ? (
            // Empty state
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                No employees found
              </td>
            </tr>
          ) : (
            // Data loaded successfully
            employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-2 text-[13px] text-[#24292E] font-normal">
                  <Avatar
                    src={employee.avatar}
                    firstName={employee.first_name}
                    lastName={employee.last_name}
                    size="sm"
                    showStatus={false}
                  />
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
                  {employee.address ? employee.address.split(',')[0] : 'Lagos'}
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
                <td className="px-6 py-4 text-right">
                  <DropdownMenu
                    options={[
                      {
                        label: 'View Details',
                        onClick: () => navigate(`/admin/user/${employee.id}`),
                      },
                      {
                        label: employee.is_blocked
                          ? 'Unblock User'
                          : 'Block User',
                        onClick: () =>
                          employee.is_blocked
                            ? handleUnblockUser(employee.id)
                            : handleBlockUser(employee.id),
                      },
                    ]}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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
