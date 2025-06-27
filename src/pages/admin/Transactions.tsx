import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsThreeDotsVertical } from 'react-icons/bs';
import adminApi from '../../api/adminApi';
import { format } from 'date-fns';

// Transaction interface based on actual API response
interface Transaction {
  id: number;
  user_id: number;
  reference_code: string;
  amount: string;
  type: string;
  status: string;
  payment_method: string;
  category: string;
  payment_metadata: any;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
    phone: string;
  };
  wallet_transaction: {
    id: number;
    user_id: number;
    recipient_id: number;
    initial_balance: string;
    current_balance: string;
    wallet_id: number;
    type: string;
    transaction_id: number;
    source: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
}

interface TransactionFilters {
  limit?: number;
  type?: string;
  status?: string;
  payment_method?: string;
  wallet_source?: string;
  from_date?: string;
  to_date?: string;
  search?: string;
  sort_by?: string;
  sort_order?: string;
  page?: number;
}

const Transactions: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'top-up' | 'salaries' | 'withdrawals'
  >('top-up');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showOptionsFor, setShowOptionsFor] = useState<number | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // Build filters based on active tab and date range
        const filters: TransactionFilters = {
          limit: itemsPerPage,
          page: currentPage,
        };

        // Map tab to type filter based on actual API response
        if (activeTab === 'top-up') {
          filters.type = 'wallet_deposit';
        } else if (activeTab === 'salaries') {
          filters.type = 'salary_payment';
        } else if (activeTab === 'withdrawals') {
          filters.type = 'wallet_withdrawal';
        }

        // Add date filters if provided
        if (startDate) {
          filters.from_date = startDate;
        }
        if (endDate) {
          filters.to_date = endDate;
        }

        // Fetch transactions from API using adminApi
        const response = await adminApi.getTransactions(filters);

        if (response.status && response.data) {
          setTransactions(response.data.data || []);
          setTotalPages(response.data.last_page || 1);
        } else {
          setTransactions([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setTransactions([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [activeTab, currentPage, itemsPerPage, startDate, endDate]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const toggleOptions = (id: number) => {
    if (showOptionsFor === id) {
      setShowOptionsFor(null);
    } else {
      setShowOptionsFor(id);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* All Transactions header with filters */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">All Transactions</h1>

        <div className="flex items-center gap-2">
          <span className="text-gray-600">Filter By</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="date"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <span>-</span>
            <div className="relative">
              <input
                type="date"
                placeholder="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History header with View All */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transaction History</h2>
        <button
          className="text-sm text-gray-600 hover:text-gray-800"
          onClick={() => navigate('/admin/all-transactions')}
        >
          View All
        </button>
      </div>

      {/* Tabs with border around all */}
      <div className="mb-6">
        <div className="inline-flex border border-gray-200 rounded-md overflow-hidden">
          <button
            className={`px-4 py-2 ${
              activeTab === 'top-up'
                ? 'bg-[#C8EDDF80] text-green-800'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('top-up')}
          >
            Wallets Top-up
          </button>
          <button
            className={`px-4 py-2 border-l border-r border-gray-200 ${
              activeTab === 'salaries'
                ? 'bg-[#C8EDDF80] text-green-800'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('salaries')}
          >
            Salaries
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === 'withdrawals'
                ? 'bg-[#C8EDDF80] text-green-800'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('withdrawals')}
          >
            Withdrawals
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-700 bg-[#C8EDDF80]">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Transaction Type</th>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      {transaction.user
                        ? `${transaction.user.first_name} ${transaction.user.last_name}`
                        : 'N/A'
                      }
                    </td>
                    <td className="py-3 px-4">{transaction.type}</td>
                    <td className="py-3 px-4">{transaction.reference_code}</td>
                    <td className="py-3 px-4">
                      {format(new Date(transaction.created_at), 'MMM dd, yyyy')}
                    </td>
                    <td className="py-3 px-4">
                      ₦{parseFloat(transaction.amount).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize">{transaction.payment_method?.replace('_', ' ')}</span>
                    </td>
                    <td className="py-3 px-4">
                      {transaction.wallet_transaction?.description || transaction.type}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          transaction.status.toLowerCase() === 'successful'
                            ? 'bg-green-100 text-green-700'
                            : transaction.status.toLowerCase() === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 relative">
                      <button
                        onClick={() => toggleOptions(transaction.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <BsThreeDotsVertical />
                      </button>

                      {showOptionsFor === transaction.id && (
                        <div className="absolute right-8 top-10 bg-white shadow-lg rounded-md py-2 w-48 z-10">
                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            View Details
                          </div>
                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            Download Receipt
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="py-8 px-6 text-center text-gray-500"
                  >
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 0 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentPage === pageNum ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default Transactions;