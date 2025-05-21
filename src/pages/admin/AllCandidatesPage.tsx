import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  created_at: string;
  address: string;
  gender: string;
  phone: string;
  is_verified: number;
}

const AllCandidatesPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('employers');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        let response;

        // Fetch data based on active tab
        if (activeTab === 'employers') {
          response = await adminApi.getEmployerList(currentPage);
        } else if (activeTab === 'agents') {
          response = await adminApi.getAgentList(currentPage);
        } else {
          response = await adminApi.getEmployeeList(currentPage);
        }

        if (response.status) {
          // Handle different response structures
          const userData = response.data.data || response.data || [];
          setUsers(userData);

          // If there's pagination info in the response, update totalPages
          if (response.data.meta && response.data.meta.last_page) {
            setTotalPages(response.data.meta.last_page);
          } else if (response.meta && response.meta.last_page) {
            setTotalPages(response.meta.last_page);
          } else {
            setTotalPages(Math.ceil(userData.length / 10) || 1);
          }
        } else {
          setError(response.message || `Failed to fetch ${activeTab}`);
        }
      } catch (err: any) {
        setError(`Error fetching ${activeTab}`);
        console.error(`Error fetching ${activeTab}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [activeTab, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-0">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-[#24292E] text-[20px] font-semibold">
          Candidates
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Here are all your candidates
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Main Content */}
      <div className="bg-white shadow rounded-lg">
        {/* Tabs */}
        <div className="px-6 pt-6 mb-4">
          <div className="flex space-x-4">
            <button
              className={`py-2 px-4 text-sm font-medium rounded ${
                activeTab === 'employers'
                  ? 'bg-[#C8EDDF80] text-[#174B35]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('employers');
                setCurrentPage(1);
              }}
            >
              Employers
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium rounded ${
                activeTab === 'agents'
                  ? 'bg-[#C8EDDF80] text-[#174B35]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('agents');
                setCurrentPage(1);
              }}
            >
              Agents
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium rounded ${
                activeTab === 'employees'
                  ? 'bg-[#C8EDDF80] text-[#174B35]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('employees');
                setCurrentPage(1);
              }}
            >
              Employees
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
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
                  Location
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
                <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal text-center">
                  Action
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
                    <td className="px-6 py-4 text-center">
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No {activeTab} found
                  </td>
                </tr>
              ) : (
                // Data loaded successfully
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-2 text-[13px] text-[#24292E] font-normal">
                      <div className="flex items-center gap-2 relative">
                        {user.avatar ? (
                          <div className="w-8 h-8 rounded-full overflow-hidden relative">
                            <img
                              src={user.avatar}
                              alt={`${user.first_name} ${user.last_name}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="bg-[#BDBDBD] rounded-full p-2 flex items-center justify-center relative">
                            <FaUser className="text-white" />
                          </div>
                        )}
                      </div>
                      {`${user.first_name} ${user.last_name}`}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                      {user.address ? user.address.split(',')[0] : 'Lagos'}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                      {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[13px] ${
                          user.is_verified === 0
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {user.is_verified === 0 ? 'Unverified' : 'Verified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => navigate(`/admin/user/${user.id}`)}
                        className="text-[#174B35] hover:text-[#0D2E20] text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && users.length > 0 && (
          <div className="flex justify-end items-center p-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${
                  currentPage === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiChevronLeft size={20} />
              </button>

              {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      currentPage === pageNumber
                        ? 'bg-gray-200 text-gray-800 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${
                  currentPage === totalPages
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCandidatesPage;
