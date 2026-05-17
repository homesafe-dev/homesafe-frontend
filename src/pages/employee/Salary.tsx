import React, { useState, useEffect, useCallback } from 'react';
import walletApi from '../../api/walletApi';
import Toast from '../../components/common/Toast';

interface TransactionUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

interface TransactionDetails {
  id: number;
  reference_code: string;
  type: string;
  status: string;
  amount: string;
  category: string;
}

interface ApiTransaction {
  id: number;
  type: string;
  source: string;
  description: string;
  user: TransactionUser;
  recipient?: TransactionUser;
  transaction: TransactionDetails;
}

interface Transaction {
  id: string;
  type: string;
  date: string;
  amount: number;
  description: string;
  from: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

const Salary: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 15,
  });
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

  // Memoize fetchTransactions
  const fetchTransactions = useCallback(async (page: number) => {
    try {
      setLoading(true);
      const response = await walletApi.getTransactions(page);

      if (response.status) {
        // Transform API data to match our component's expected format
        const formattedTransactions = response.data.data.map(
          (item: ApiTransaction) => {
            // Format date - assuming we need to create a date string
            // In a real app, the API might provide a timestamp we'd format
            const date = new Date().toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return {
              id: item.transaction.reference_code,
              type: item.type === 'credit' ? 'Credit' : 'Debit',
              date: date,
              amount: parseFloat(item.transaction.amount),
              description: item.description,
              from: item.recipient
                ? `${item.recipient.first_name} ${item.recipient.last_name}`
                : item.source === 'salary'
                  ? 'Employer'
                  : item.source,
            };
          }
        );

        setTransactions(formattedTransactions);

        // Set pagination data
        if (response.data.meta) {
          setPagination({
            current_page: response.data.meta.current_page,
            last_page: response.data.meta.last_page,
            total: response.data.meta.total,
            per_page: response.data.meta.per_page,
          });
        }
      } else {
        const errorMessage = 'Failed to fetch transactions';
        // setError(errorMessage); // This line was removed as per the new_code
        showToast(errorMessage, 'error');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      const errorMessage =
        'Error fetching transactions. Please try again later.';
      // setError(errorMessage); // This line was removed as per the new_code
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(1);
  }, [fetchTransactions]);

  // Removed fallback data as it's not being used

  return (
    <div className="rounded-lg border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-1">
        <h1 className="text-[20px] font-semibold text-gray-900 dark:text-gray-100">
          Salary
        </h1>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2 className="text-[16px] text-gray-900 dark:text-gray-100 font-semibold mt-[1rem]">
          Transaction History
        </h2>
        {pagination.last_page > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => fetchTransactions(pagination.current_page - 1)}
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
              onClick={() => fetchTransactions(pagination.current_page + 1)}
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
                    Transaction Type
                  </th>
                  <th className="py-3 px-2 bg-[#E7F6F0] whitespace-nowrap">
                    Transaction ID
                  </th>
                  <th className="py-3 px-2 bg-[#E7F6F0] whitespace-nowrap">
                    Date
                  </th>
                  <th className="py-3 px-2 bg-[#E7F6F0] whitespace-nowrap">
                    Amount
                  </th>
                  <th className="py-3 px-2 bg-[#E7F6F0] whitespace-nowrap">
                    Description
                  </th>
                  <th className="py-3 px-2 bg-[#E7F6F0] whitespace-nowrap">
                    From/To
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="py-3 px-2 whitespace-nowrap">
                        {transaction.type}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        {transaction.id}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        {transaction.date}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        ₦ {transaction.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        {transaction.description}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        {transaction.from}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

export default Salary;
