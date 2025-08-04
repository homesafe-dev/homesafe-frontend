import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import agentApi from '../../api/agentApi';
import Avatar from '../../components/common/Avatar';
import Toast from '../../components/common/Toast';

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

const AllCandidatesPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const response = await agentApi.getTrackedEmployees();
        if (response.status) {
          setEmployees(response.data);
          // If there's pagination info in the response, update totalPages
          if (response.meta && response.meta.last_page) {
            setTotalPages(response.meta.last_page);
          }
        } else {
          const errorMessage = response.message || 'Failed to fetch employees';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        }
      } catch (err: any) {
        const errorMessage = 'Error fetching employees';
        setError(errorMessage);
        showToast(errorMessage, 'error');
        console.error('Error fetching employees:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h1 className="text-[20px] sm:text-[24px] text-[#24292E] font-semibold">
          Candidates
        </h1>
        <button
          className="bg-[#A5EA91] text-[#174B35] px-3 sm:px-4 py-2 rounded-[8px] flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
          onClick={() => navigate('/agent/add-candidate')}
        >
          <span>+</span>
          <span className="hidden sm:inline">Add New Candidate</span>
          <span className="sm:hidden">Add Candidate</span>
        </button>
      </div>



      {/* Subheader */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <p className="text-[#24292E] text-[14px] sm:text-[16px]">
          Here are all your candidates
        </p>
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto overflow-y-visible"
        style={{ marginLeft: '-1rem', marginRight: '-1rem' }}
      >
        <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
          <table className="w-full" style={{ minWidth: '700px' }}>
            <thead className="bg-[#C8EDDF80] h-[56px] text-left">
              <tr>
                <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal whitespace-nowrap">
                  Candidate
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
              ) : employees.length === 0 ? (
                // Empty state
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No candidates found
                  </td>
                </tr>
              ) : (
                // Data loaded successfully
                employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-2 text-[13px] text-[#24292E] font-normal whitespace-nowrap">
                      <Avatar
                        src={employee.avatar}
                        firstName={employee.candidate.split(' ')[0] || ''}
                        lastName={employee.candidate.split(' ')[1] || ''}
                        size="sm"
                        showStatus={true}
                        isOnline={true}
                      />
                      {employee.candidate}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal whitespace-nowrap">
                      {new Date(employee.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal whitespace-nowrap">
                      {employee.placement}
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

      {/* Pagination */}
      {!isLoading && employees.length > 0 && (
        <div className="flex justify-center sm:justify-end items-center gap-2 mt-4">
          <button
            className="p-2 rounded-full w-[40px] h-[40px] hover:bg-gray-100"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                className={`p-2 rounded-full w-[40px] h-[40px] ${
                  pageNumber === currentPage
                    ? 'bg-gray-200'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            className="p-2 rounded-full w-[40px] h-[40px] hover:bg-gray-100"
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default AllCandidatesPage;
