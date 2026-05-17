import React, { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import walletApi from '../../api/walletApi';
import { WalletTransaction } from '../../types/wallet';

const WalletPage: React.FC = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [walletBalance, setWalletBalance] = useState<string>('0.00');
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    WalletTransaction[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Filter transactions
  useEffect(() => {
    let filtered = [...transactions];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tx) =>
          tx.transaction.reference_code?.toLowerCase().includes(query) ||
          tx.description?.toLowerCase().includes(query) ||
          tx.source?.toLowerCase().includes(query) ||
          tx.type?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (tx) =>
          tx.transaction.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(
        (tx) => tx.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    setFilteredTransactions(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [transactions, searchQuery, statusFilter, typeFilter, itemsPerPage]);

  // Get paginated transactions
  const getPaginatedTransactions = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  };

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await walletApi.getBalance();
        if (response.status && response.data) {
          setWalletBalance(response.data.current_balance);
        }
      } catch (err) {
        console.error('Error fetching wallet balance:', err);
      }
    };

    fetchWalletBalance();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await walletApi.getTransactions(currentPage, 100);
        if (response.status && response.data && response.data.data) {
          setTransactions(response.data.data);
          setFilteredTransactions(response.data.data);
        }
      } catch (err: any) {
        console.error('Error fetching transactions:', err);
        setError(err.message || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage]);

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount);
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'successful' || statusLower === 'completed') {
      return 'bg-green-50 text-green-700';
    } else if (statusLower === 'pending') {
      return 'bg-yellow-50 text-yellow-700';
    } else {
      return 'bg-red-50 text-red-700';
    }
  };

  // Calculate stats
  const totalCredits = transactions
    .filter((tx) => tx.type === 'credit' || tx.type === 'deposit')
    .reduce((sum, tx) => sum + parseFloat(tx.transaction.amount), 0);

  const totalDebits = transactions
    .filter((tx) => tx.type === 'debit' || tx.type === 'withdrawal')
    .reduce((sum, tx) => sum + parseFloat(tx.transaction.amount), 0);

  const successfulCount = transactions.filter(
    (tx) => tx.transaction.status === 'successful'
  ).length;

  const hasActiveFilters =
    searchQuery.trim() !== '' || statusFilter !== 'all' || typeFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  return (
    <div className="p-0">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Wallet
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          View your wallet balance and transaction history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Balance Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#174B35] to-[#246D51] rounded-lg shadow-lg p-4 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <line
                x1="40"
                y1="0"
                x2="90"
                y2="100"
                stroke="white"
                strokeWidth="1"
              />
              <line
                x1="45"
                y1="0"
                x2="95"
                y2="100"
                stroke="white"
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="0"
                x2="100"
                y2="100"
                stroke="white"
                strokeWidth="1"
              />
              <line
                x1="55"
                y1="0"
                x2="105"
                y2="100"
                stroke="white"
                strokeWidth="1"
              />
              <line
                x1="60"
                y1="0"
                x2="110"
                y2="100"
                stroke="white"
                strokeWidth="1"
              />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/90 text-sm font-medium">
                Current Balance
              </span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white dark:bg-gray-800/10 transition-colors"
                aria-label="Toggle balance visibility"
              >
                {showBalance ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="flex-1 flex items-center mb-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {showBalance ? formatCurrency(walletBalance) : '••••••••'}
              </h2>
            </div>
            <div className="text-white/80 text-xs sm:text-sm">
              Your available wallet balance
            </div>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Quick Stats
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Total Credits
                </span>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(totalCredits)}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Total Debits
                </span>
                <TrendingDown className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(totalDebits)}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Successful
                </span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {successfulCount} of {transactions.length}
              </p>
            </div>
          </div>
          <Link to="/employee/transactions">
            <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-[#246D51] bg-green-50 hover:bg-green-100 rounded-md transition-colors flex items-center justify-center gap-2">
              View All Transactions
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100">
        <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
              Recent Transactions
            </h2>
            <Link to="/employee/transactions">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm appearance-none bg-white dark:bg-gray-800"
                >
                  <option value="all">All Status</option>
                  <option value="successful">Successful</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Type Filter */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="pl-4 pr-8 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm appearance-none bg-white dark:bg-gray-800"
                >
                  <option value="all">All Types</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                </select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
              {error}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {hasActiveFilters
                  ? 'No transactions match your filters'
                  : 'No transactions found'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-3 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Reference
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100">
                    {getPaginatedTransactions().map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {transaction.type === 'credit' ||
                            transaction.type === 'deposit' ? (
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-600" />
                            )}
                            <span className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                              {transaction.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-mono">
                          {transaction.transaction.reference_code?.substring(
                            0,
                            12
                          ) || 'N/A'}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {(transaction.transaction as any).created_at
                            ? format(
                                new Date(
                                  (transaction.transaction as any).created_at
                                ),
                                'MMM dd, yyyy'
                              )
                            : '-'}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(transaction.transaction.amount)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              transaction.transaction.status
                            )}`}
                          >
                            {transaction.transaction.status
                              .charAt(0)
                              .toUpperCase() +
                              transaction.transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {transaction.description || transaction.source || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{' '}
                    <span className="font-medium">
                      {Math.min(
                        (currentPage - 1) * itemsPerPage + 1,
                        filteredTransactions.length
                      )}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredTransactions.length
                      )}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">
                      {filteredTransactions.length}
                    </span>{' '}
                    results
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg border transition-colors ${
                        currentPage === 1
                          ? 'border-gray-200 dark:border-gray-700 text-gray-300 cursor-not-allowed'
                          : 'border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
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
                              onClick={() => setCurrentPage(page)}
                              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                currentPage === page
                                  ? 'bg-green-600 text-white'
                                  : 'border border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
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
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg border transition-colors ${
                        currentPage === totalPages
                          ? 'border-gray-200 dark:border-gray-700 text-gray-300 cursor-not-allowed'
                          : 'border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
