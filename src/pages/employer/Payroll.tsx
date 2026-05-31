import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CalendarSync,
  User,
  Briefcase,
  Calendar,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
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

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'active' || statusLower === 'completed') {
      return 'bg-green-50 text-green-700';
    } else if (statusLower === 'pending') {
      return 'bg-yellow-50 text-yellow-700';
    } else {
      return 'bg-gray-50 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="p-0">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <CalendarSync className="w-4 h-4 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Payroll
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Manage and view payroll history
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-surface rounded-lg shadow-sm border border-border-default">
        {/* Header with View All */}
        <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-border-default">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Payroll History
            </h2>
            <Link to="/employer/payroll/all">
              <button className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg inline-block">
                {error}
              </div>
            </div>
          ) : payrollEntries.length > 0 ? (
            <>
              <table className="w-full">
                <thead className="bg-elevated border-b border-border-default">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Staff
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Payment Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Advance Salary
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-border-default">
                  {payrollEntries.map((entry, index) => (
                    <tr
                      key={entry.id || index}
                      className="hover:bg-elevated/50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {entry.staff?.name || entry.employee_name || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {entry.position || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(entry.amount)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {formatDate(entry.payment_date)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {entry.advanced_salary ? (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-orange-400" />
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {typeof entry.advanced_salary === 'number'
                                ? formatCurrency(entry.advanced_salary)
                                : entry.advanced_salary}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            entry.status || ''
                          )}`}
                        >
                          {entry.status || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border-default px-4 sm:px-6">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        currentPage === 1
                          ? 'border-gray-200 dark:border-gray-700 text-gray-300 cursor-not-allowed'
                          : 'border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-elevated/50'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                currentPage === page
                                  ? 'bg-green-600 text-white'
                                  : 'border border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-elevated/50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span
                              key={page}
                              className="px-2 text-gray-500 dark:text-gray-400"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      }
                    )}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        currentPage === totalPages
                          ? 'border-gray-200 dark:border-gray-700 text-gray-300 cursor-not-allowed'
                          : 'border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-elevated/50'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center">
              <CalendarSync className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No payroll entries found
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Payroll history will appear here once entries are created
              </p>
            </div>
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
