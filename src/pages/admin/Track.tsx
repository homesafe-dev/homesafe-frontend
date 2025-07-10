import { useState, useEffect } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { FaRegUser } from 'react-icons/fa';
import adminApi from '../../api/adminApi';
import Avatar from '../../components/common/Avatar';

interface Employee {
  id: number;
  candidate: string | null;
  title: string | null;
  email: string;
  avatar: string | null;
  date: string;
  placement: string | null;
  gender: string | null;
  phone: string | null;
  is_verified: number;
  approval_status: string;
  is_blocked?: boolean;
  status: string; // Keep for backward compatibility
}

const AdminTrack = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOptionsFor, setShowOptionsFor] = useState<number | null>(null);

  // Helper function to safely format gender
  const formatGender = (gender: string | null): string => {
    if (!gender || typeof gender !== 'string') return 'N/A';
    return gender.charAt(0).toUpperCase() + gender.slice(1);
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

        const response = await adminApi.getTrackedEmployees(1, 50);
        console.log('Tracked Employees API Response:', response); // Debug log

        if (response.status) {
          // Handle the response data structure
          const employeeData = response.data || [];
          setEmployees(employeeData);
        } else {
          setError(response.message || 'Failed to fetch employees');
        }
      } catch (err: any) {
        setError('Error fetching employees');
        console.error('Error fetching employees:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

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
        setEmployees(
          employees.map((emp) =>
            emp.id === userId ? { ...emp, is_blocked: true } : emp
          )
        );
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
        setEmployees(
          employees.map((emp) =>
            emp.id === userId ? { ...emp, is_blocked: false } : emp
          )
        );
      } else {
        alert(response.message || 'Failed to unblock user');
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      alert('An error occurred while unblocking the user');
    }
    setShowOptionsFor(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Track</h2>
      <div className="flex justify-between items-center mt-[2rem]">
        <p className="text-gray-600 mb-6">Here are all your employees</p>
        <div className="text-sm text-gray-600">
          <span
            className="cursor-pointer hover:text-green-700"
            onClick={() => navigate('/admin/all-candidates')}
          >
            View All
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#C8EDDF80] text-[#174B35] text-sm">
                <th className="px-4 py-3 text-left font-medium">Candidate</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Placement</th>
                <th className="px-4 py-3 text-left font-medium">Gender</th>
                <th className="px-4 py-3 text-left font-medium">
                  Phone Number
                </th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">
                  Blocked Status
                </th>
                <th className="px-4 py-3 text-left font-medium w-12"></th>
              </tr>
            </thead>
            <tbody className="">
              {isLoading ? (
                // Loading state - show skeleton rows
                [...Array(3)].map((_, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 animate-pulse"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-4"></div>
                    </td>
                  </tr>
                ))
              ) : employees.length === 0 ? (
                // Empty state
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-3 text-center text-gray-500"
                  >
                    No candidates found
                  </td>
                </tr>
              ) : (
                // Data loaded successfully
                employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 flex items-center gap-3">
                      <Avatar
                        src={employee.avatar}
                        firstName={employee.candidate?.split(' ')[0] || 'Unknown'}
                        lastName={employee.candidate?.split(' ')[1] || 'User'}
                        size="sm"
                        showStatus={false}
                      />
                      <span>{employee.candidate || 'Unknown Candidate'}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(employee.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {employee.placement || 'No placement assigned'}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatGender(employee.gender)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {employee.phone || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      {(() => {
                        const status = getEmployeeStatus(employee);
                        return (
                          <button
                            className={`px-3 py-1 rounded-full text-[13px] ${status.style}`}
                          >
                            {status.text}
                          </button>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3">
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
                    <td className="px-4 py-3 relative">
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
                            onClick={() =>
                              navigate(
                                `/admin/candidate-profile/${employee.id}`
                              )
                            }
                          >
                            <FaRegUser className="text-gray-500" />
                            <span>View Profile</span>
                          </div>
                          {employee.is_blocked ? (
                            <div
                              className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleUnblockUser(employee.id)}
                            >
                              <svg
                                className="w-4 h-4 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-green-600">
                                Unblock User
                              </span>
                            </div>
                          ) : (
                            <div
                              className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleBlockUser(employee.id)}
                            >
                              <svg
                                className="w-4 h-4 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                              </svg>
                              <span className="text-red-600">Block User</span>
                            </div>
                          )}
                          {/* <div className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer">
                            <RiDeleteBin6Line className="text-gray-500" />
                            <span>Remove</span>
                          </div> */}
                        </div>
                      )}
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
};

export default AdminTrack;
