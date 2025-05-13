import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import CreatePayrollModal from '../../components/Employer/CreatePayrollModal';
import payrollApi from '../../api/payrollApi';
import { PayrollEntry } from '../../types/payroll';

const PayrollPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [payrollEntries, setPayrollEntries] = useState<PayrollEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchPayrollHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await payrollApi.getPayrollHistory(currentPage);

      if (response && response.status === true) {
        // Handle different response structures
        if (Array.isArray(response.data)) {
          // Direct array response
          setPayrollEntries(response.data);
          setTotalPages(1); // No pagination info available
        } else if (response.data && typeof response.data === 'object') {
          // Paginated response
          if ('data' in response.data && Array.isArray(response.data.data)) {
            setPayrollEntries(response.data.data);
            setTotalPages(response.data.last_page || 1);
          } else {
            console.error('Unexpected data format:', response.data);
            setError('Unexpected data format received from API');
          }
        } else {
          console.error('Unexpected response format:', response);
          setError('Unexpected response format received from API');
        }
      } else {
        setError(response?.message || 'Failed to load payroll history');
      }
    } catch (err: any) {
      console.error('Error fetching payroll history:', err);
      setError(err.message || 'Failed to load payroll history');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchPayrollHistory();
  }, [fetchPayrollHistory]);

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    // Refresh payroll history after creating a new entry
    fetchPayrollHistory();
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[20px] font-semibold text-[#24292E]">Payroll</h1>
        <button
          className="bg-[#A5EA91] text-[#24292E] font-semibold w-[211px] h-[38px] px-4 py-2 rounded-md text-[13px] flex items-center gap-2"
          onClick={handleOpenCreateModal}
        >
          <FaPlus size={12} />
          <span>Add New Staff to Payroll</span>
        </button>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-[#24292E]">
            Payroll History
          </h2>
          <Link to="/employer/payroll/all">
            {' '}
            <button className="text-[#24292E] fonnt-semibold text-[13px]">
              View All
            </button>
          </Link>
        </div>

        <div className="w-full mt-[1rem]">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
              {error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-6 bg-[#C8EDDF80] rounded-t-lg">
                <div className="p-3 text-sm font-medium text-gray-600">
                  Staff
                </div>
                <div className="p-3 text-sm font-medium text-gray-600">
                  Position
                </div>
                <div className="p-3 text-sm font-medium text-gray-600">
                  Amount
                </div>
                <div className="p-3 text-sm font-medium text-gray-600">
                  Payment Date
                </div>
                <div className="p-3 text-sm font-medium text-gray-600">
                  Advance Salary
                </div>
                <div className="p-3 text-sm font-medium text-gray-600">
                  Status
                </div>
              </div>

              <div className="bg-white">
                {payrollEntries.length > 0 ? (
                  payrollEntries.map((entry, index) => (
                    <div
                      key={entry.id || index}
                      className="grid grid-cols-6 border-b border-[#DEE0E3]"
                    >
                      <div className="p-3 text-sm text-gray-800">
                        {entry.employee_name || 'N/A'}
                      </div>
                      <div className="p-3 text-sm text-gray-800">
                        {entry.position || 'N/A'}
                      </div>
                      <div className="p-3 text-sm text-gray-800">
                        ₦{' '}
                        {typeof entry.amount === 'number'
                          ? entry.amount.toLocaleString()
                          : entry.amount}
                      </div>
                      <div className="p-3 text-sm text-gray-800">
                        {entry.payment_date || 'N/A'}
                      </div>
                      <div className="p-3 text-sm text-gray-800">
                        {entry.advanced_salary
                          ? typeof entry.advanced_salary === 'number'
                            ? `₦ ${entry.advanced_salary.toLocaleString()}`
                            : entry.advanced_salary
                          : '-'}
                      </div>
                      <div className="p-3">
                        <span
                          className={`px-3 py-1 rounded-md text-sm ${
                            entry.status?.toLowerCase() === 'active'
                              ? 'bg-[#C8EDDF80] text-green-800'
                              : entry.status?.toLowerCase() === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {entry.status || 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No payroll entries found
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-end items-center gap-4 mt-6">
                  <button
                    className="p-2"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FaChevronLeft
                      size={14}
                      className={
                        currentPage === 1 ? 'text-gray-300' : 'text-gray-500'
                      }
                    />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${
                          currentPage === page
                            ? 'bg-[#00000014] text-[#000000DE] font-medium'
                            : 'text-[#000000DE]'
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    className="p-2"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <FaChevronRight
                      size={14}
                      className={
                        currentPage === totalPages
                          ? 'text-gray-300'
                          : 'text-[#000000DE]'
                      }
                    />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <CreatePayrollModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />
    </div>
  );
};

export default PayrollPage;
