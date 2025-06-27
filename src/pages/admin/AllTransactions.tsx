import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
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

const AllTransactions: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'top-up' | 'salaries' | 'withdrawals'
  >('top-up');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('');
  const [walletSourceFilter, setWalletSourceFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
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

        // Add search filter if provided
        if (searchTerm.trim()) {
          filters.search = searchTerm.trim();
        }

        // Add additional filters
        if (statusFilter) {
          filters.status = statusFilter;
        }
        if (paymentMethodFilter) {
          filters.payment_method = paymentMethodFilter;
        }
        if (walletSourceFilter) {
          filters.wallet_source = walletSourceFilter;
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
  }, [activeTab, currentPage, itemsPerPage, startDate, endDate, searchTerm, statusFilter, paymentMethodFilter, walletSourceFilter]);

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

  const handleBack = () => {
    navigate(-1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPaymentMethodFilter('');
    setWalletSourceFilter('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex items-center mb-1">
        <IoArrowBack
          className="text-gray-600 mr-2 cursor-pointer"
          size={20}
          onClick={handleBack}
        />
        <h1 className="text-[20px] font-semibold text-[#24292E]">See All</h1>
      </div>

      {/* Filter section */}
      <div className="flex justify-end mb-6 mt-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="successful">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">All Payment Methods</option>
            <option value="external_funding">External Funding</option>
            <option value="wallet_transfer">Wallet Transfer</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>

          {/* Wallet Source Filter */}
          <select
            value={walletSourceFilter}
            onChange={(e) => setWalletSourceFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">All Sources</option>
            <option value="top-up">Top-up</option>
            <option value="salary">Salary</option>
            <option value="withdrawal">Withdrawal</option>
          </select>

          <div className="flex items-center gap-2">
            <span className="text-gray-600">Date Range</span>
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

          {/* Clear Filters Button */}
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-[#24292E]">
            All Transactions
          </h2>
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

        <div className="w-full mt-[1rem]">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <>
              {/* Transactions Table */}
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
                          <td className="py-3 px-4">{transaction.wallet_transaction?.description || transaction.type}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs ${
                                transaction.status.toLowerCase() ===
                                'successful'
                                  ? 'bg-green-100 text-green-700'
                                  : transaction.status.toLowerCase() ===
                                      'pending'
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

              {/* Pagination */}
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
    </div>
  );
};

export default AllTransactions;
