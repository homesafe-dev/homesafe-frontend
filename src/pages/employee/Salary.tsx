import React, { useState, useEffect, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import userApi from '../../api/userApi';
import Toast from '../../components/common/Toast';

interface SalaryHistoryItem {
  id: number;
  previous_salary: string;
  new_salary: string;
  change_reason: string;
  effective_date: string;
  created_at: string;
  updated_at: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

const PER_PAGE = 15;

const formatSalary = (value: string | number): string => {
  const amount = parseFloat(String(value));
  if (Number.isNaN(amount)) return '—';
  return `₦ ${amount.toLocaleString()}`;
};

const formatDate = (value: string): string => {
  try {
    return format(parseISO(value), 'd MMM yyyy');
  } catch {
    return value;
  }
};

const Salary: React.FC = () => {
  const [salaryHistory, setSalaryHistory] = useState<SalaryHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: PER_PAGE,
  });
  const [toast, setToast] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
    isVisible: false,
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const fetchSalaryHistory = useCallback(async (page: number) => {
    try {
      setLoading(true);

      const profileResponse = await userApi.getProfile();
      if (!profileResponse.status || !profileResponse.data?.id) {
        showToast('Failed to load profile', 'error');
        return;
      }

      const userId = profileResponse.data.id;
      const response = await userApi.getSalaryHistory(userId, page, PER_PAGE);

      if (response.status && response.data?.data) {
        setSalaryHistory(response.data.data);

        if (response.data.meta) {
          setPagination({
            current_page: response.data.meta.current_page,
            last_page: response.data.meta.last_page,
            total: response.data.meta.total,
            per_page: response.data.meta.per_page,
          });
        }
      } else {
        showToast(
          response.message || 'Failed to fetch salary history',
          'error'
        );
      }
    } catch (err) {
      console.error('Error fetching salary history:', err);
      showToast(
        'Error fetching salary history. Please try again later.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalaryHistory(1);
  }, [fetchSalaryHistory]);

  return (
    <div className="rounded-lg border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-1">
        <h1 className="text-[20px] font-semibold text-gray-900 dark:text-gray-100">
          Salary
        </h1>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2 className="text-[16px] text-gray-900 dark:text-gray-100 font-semibold mt-[1rem]">
          Salary History
        </h2>
        {pagination.last_page > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => fetchSalaryHistory(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className={`px-2 sm:px-3 py-1 rounded text-sm ${
                pagination.current_page === 1
                  ? 'bg-gray-200 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-[#A5EA91] text-gray-700 dark:text-gray-300 hover:bg-green-200'
              }`}
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>
            <span className="px-2 sm:px-3 py-1 text-sm whitespace-nowrap">
              Page {pagination.current_page} of {pagination.last_page}
            </span>
            <button
              onClick={() => fetchSalaryHistory(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className={`px-2 sm:px-3 py-1 rounded text-sm ${
                pagination.current_page === pagination.last_page
                  ? 'bg-gray-200 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-[#A5EA91] text-gray-700 dark:text-gray-300 hover:bg-green-200'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div
          className="overflow-x-auto overflow-y-visible"
          style={{ marginLeft: '-1rem', marginRight: '-1rem' }}
        >
          <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
            <table className="w-full text-sm" style={{ minWidth: '800px' }}>
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 px-2 bg-[#E7F6F0] whitespace-nowrap">
                    Effective Date
                  </th>
                  <th className="py-3 px-2 bg-[#E7F6F0] whitespace-nowrap">
                    Previous Salary
                  </th>
                  <th className="py-3 px-2 bg-[#E7F6F0] whitespace-nowrap">
                    New Salary
                  </th>
                  <th className="py-3 px-2 bg-[#E7F6F0] whitespace-nowrap">
                    Change Reason
                  </th>
                  <th className="py-3 px-2 bg-[#E7F6F0] whitespace-nowrap">
                    Recorded On
                  </th>
                </tr>
              </thead>
              <tbody>
                {salaryHistory.length > 0 ? (
                  salaryHistory.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-elevated/50"
                    >
                      <td className="py-3 px-2 whitespace-nowrap">
                        {formatDate(item.effective_date)}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        {formatSalary(item.previous_salary)}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        {formatSalary(item.new_salary)}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        {item.change_reason}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        {formatDate(item.created_at)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      No salary history found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default Salary;
