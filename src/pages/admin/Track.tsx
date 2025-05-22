import React, { useState, useEffect } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaRegUser } from 'react-icons/fa';
import adminApi from '../../api/adminApi';

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

const AdminTrack = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOptionsFor, setShowOptionsFor] = useState<number | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const response = await adminApi.getTrackedEmployees();
        if (response.status) {
          setEmployees(response.data);
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
                      <div className="h-4 bg-gray-200 rounded w-4"></div>
                    </td>
                  </tr>
                ))
              ) : employees.length === 0 ? (
                // Empty state
                <tr>
                  <td
                    colSpan={7}
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
                        <div className="bg-gray-200 rounded-full p-2 flex items-center justify-center relative">
                          <FaUser className="text-white" />
                          <div className="absolute w-3 h-3 bg-green-500 rounded-full -top-1 -right-1 border-2 border-white" />
                        </div>
                      )}
                      <span>{employee.candidate}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(employee.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {employee.placement}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {employee.gender.charAt(0).toUpperCase() +
                        employee.gender.slice(1)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {employee.phone}
                    </td>
                    <td className="px-4 py-3">
                      <button
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
                      </button>
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
                          <div className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer">
                            <RiDeleteBin6Line className="text-gray-500" />
                            <span>Remove</span>
                          </div>
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
