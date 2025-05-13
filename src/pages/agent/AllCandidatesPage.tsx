import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import agentApi from '../../api/agentApi';

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
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[24px] text-[#24292E] font-semibold">Candidates</h1>
        <button
          className="bg-[#A5EA91] text-[#174B35] px-4 py-2 rounded-[8px] flex items-center gap-2"
          onClick={() => navigate('/agent/add-candidate')}
        >
          <span>+</span>
          Add New Candidate
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Subheader */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-[#24292E] text-[16px]">
          Here are all your candidates
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#C8EDDF80] h-[56px] text-left">
            <tr>
              <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
                Candidate
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
            ) : employees.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No candidates found
                </td>
              </tr>
            ) : (
              // Data loaded successfully
              employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-2 text-[13px] text-[#24292E] font-normal">
                    <div className="flex items-center gap-2 relative">
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
                        <div className="bg-[#BDBDBD] rounded-full p-2 flex items-center justify-center relative">
                          <FaUser className="text-white" />
                          <div className="absolute w-3 h-3 bg-green-500 rounded-full -top-1 -right-1 border-2 border-white" />
                        </div>
                      )}
                    </div>
                    {employee.candidate}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                    {new Date(employee.date).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                    {employee.placement}
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
                        employee.status.toLowerCase().includes('not') ||
                        employee.status.toLowerCase() === 'unverified'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {employee.status.toLowerCase().includes('not')
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

      {/* Pagination */}
      {!isLoading && employees.length > 0 && (
        <div className="flex justify-end items-center gap-2 mt-4">
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
    </div>
  );
};

export default AllCandidatesPage;
