import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MoreVertical,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Calendar,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  Activity,
} from 'lucide-react';
import adminApi from '../../api/adminApi';
import transactionApi, {
  TransactionStatsResponse,
} from '../../api/transactionApi';
import { format } from 'date-fns';
import Avatar from '../../components/common/Avatar';

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

type PeriodType = 'today' | 'week' | 'month' | 'year' | 'all' | 'custom';

const Transactions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'top-up' | 'salaries' | 'withdrawals'
  >('top-up');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showOptionsFor, setShowOptionsFor] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Stats state
  const [stats, setStats] = useState<TransactionStatsResponse['data'] | null>(
    null
  );
  const [loadingStats, setLoadingStats] = useState<boolean>(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowOptionsFor(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter transactions based on search and filters
  useEffect(() => {
    let filtered = [...transactions];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tx) =>
          `${tx.user?.first_name || ''} ${tx.user?.last_name || ''}`
            .toLowerCase()
            .includes(query) ||
          tx.reference_code?.toLowerCase().includes(query) ||
          tx.user?.email?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (tx) => tx.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Payment method filter
    if (paymentMethodFilter !== 'all') {
      filtered = filtered.filter(
        (tx) => tx.payment_method === paymentMethodFilter
      );
    }

    setFilteredTransactions(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    transactions,
    searchQuery,
    statusFilter,
    paymentMethodFilter,
    itemsPerPage,
  ]);

  // Get paginated transactions
  const getPaginatedTransactions = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        // Build filters based on active tab and date range
        const filters: TransactionFilters = {
          limit: 100, // Fetch more to allow client-side filtering
          page: 1,
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
          const txData = response.data.data || [];
          setTransactions(txData);
          setFilteredTransactions(txData);
        } else {
          setTransactions([]);
          setFilteredTransactions([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Failed to fetch transactions');
        setTransactions([]);
        setFilteredTransactions([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [activeTab, startDate, endDate, itemsPerPage]);

  // Fetch transaction stats
  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const filters: {
          period?: PeriodType;
          from_date?: string;
          to_date?: string;
        } = {
          period: selectedPeriod,
        };

        // If custom period, add date range
        if (selectedPeriod === 'custom') {
          if (startDate) filters.from_date = startDate;
          if (endDate) filters.to_date = endDate;
        }

        const response = await transactionApi.getTransactionStats(filters);
        if (response.status && response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching transaction stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [selectedPeriod, startDate, endDate]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPaymentMethodFilter('all');
    setStartDate('');
    setEndDate('');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    paymentMethodFilter !== 'all' ||
    startDate !== '' ||
    endDate !== '';

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

  // Handle period change
  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period);
    if (period !== 'custom') {
      setStartDate('');
      setEndDate('');
    }
  };

  return (
    <div className="p-0">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Transactions
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          View and manage all transactions in the system
        </p>
      </div>

      {/* Summary Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">
                Total Volume
              </span>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(stats.summary.total_volume)}
            </div>
            <div className="text-xs text-gray-500">
              {stats.summary.total_transactions.toLocaleString()} transactions
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">
                Total Credits
              </span>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <ArrowUpCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(stats.summary.total_credits)}
            </div>
            <div className="text-xs text-gray-500">Inflows</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">
                Total Withdrawals
              </span>
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <ArrowDownCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(stats.summary.total_withdrawals)}
            </div>
            <div className="text-xs text-gray-500">Outflows</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">
                Success Rate
              </span>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.summary.success_rate.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">
              {stats.summary.successful_count.toLocaleString()} successful
            </div>
          </div>
        </div>
      )}

      {/* Loading Stats Skeleton */}
      {loadingStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {/* Period Filter */}
        <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-sm font-medium text-gray-700">Period:</span>
            <div className="flex flex-wrap gap-2">
              {(['today', 'week', 'month', 'year', 'all'] as PeriodType[]).map(
                (period) => (
                  <button
                    key={period}
                    onClick={() => handlePeriodChange(period)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      selectedPeriod === period
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                )
              )}
              <button
                onClick={() => handlePeriodChange('custom')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selectedPeriod === 'custom'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                }`}
              >
                Custom
              </button>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="px-4 sm:px-6 pb-4 border-b border-gray-100">
          <div className="flex flex-wrap gap-2 sm:gap-0 sm:space-x-1">
            <button
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'top-up'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('top-up')}
            >
              Wallets Top-up
            </button>
            <button
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'salaries'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('salaries')}
            >
              Salaries
            </button>
            <button
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'withdrawals'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('withdrawals')}
            >
              Withdrawals
            </button>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="p-4 sm:p-6">
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or reference code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="successful">Successful</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Payment Method Filter */}
              <div className="relative">
                <select
                  value={paymentMethodFilter}
                  onChange={(e) => setPaymentMethodFilter(e.target.value)}
                  className="pl-4 pr-8 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm appearance-none bg-white"
                >
                  <option value="all">All Methods</option>
                  <option value="external_funding">External Funding</option>
                  <option value="wallet_transfer">Wallet Transfer</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Date Range */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Date Range:</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 flex-1">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
                <span className="hidden sm:block text-gray-400 self-center">
                  to
                </span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              Showing {filteredTransactions.length} of {transactions.length}{' '}
              transactions
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  // Loading state
                  [...Array(5)].map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-28"></div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="h-8 bg-gray-200 rounded w-8 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : error ? (
                  // Error state
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 sm:px-6 py-12 text-center text-red-600"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <p className="font-medium">{error}</p>
                        <p className="text-sm text-gray-500">
                          Please try refreshing the page
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  // Empty state
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 sm:px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <CreditCard className="w-12 h-12 text-gray-300" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {hasActiveFilters
                              ? 'No transactions match your filters'
                              : 'No transactions found'}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {hasActiveFilters
                              ? 'Try adjusting your search or filters'
                              : 'Transactions will appear here once they are processed'}
                          </p>
                        </div>
                        {hasActiveFilters && (
                          <button
                            onClick={clearFilters}
                            className="mt-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Data rows
                  getPaginatedTransactions().map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={transaction.user?.avatar}
                            firstName={transaction.user?.first_name || ''}
                            lastName={transaction.user?.last_name || ''}
                            size="sm"
                            showStatus={false}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.user
                                ? `${transaction.user.first_name} ${transaction.user.last_name}`
                                : 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-[200px]">
                              {transaction.user?.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          {transaction.type === 'wallet_deposit' ||
                          transaction.type === 'salary_payment' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                          <span className="capitalize">
                            {transaction.type?.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {transaction.reference_code || 'N/A'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(
                          new Date(transaction.created_at),
                          'MMM dd, yyyy'
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="capitalize">
                          {transaction.payment_method?.replace('_', ' ') ||
                            'N/A'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative" ref={dropdownRef}>
                          <button
                            onClick={() =>
                              setShowOptionsFor(
                                showOptionsFor === transaction.id
                                  ? null
                                  : transaction.id
                              )
                            }
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {showOptionsFor === transaction.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    // Navigate to transaction details
                                    setShowOptionsFor(null);
                                  }}
                                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>
                                <button
                                  onClick={() => {
                                    // Download receipt
                                    setShowOptionsFor(null);
                                  }}
                                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Download className="w-4 h-4" />
                                  Download Receipt
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && !error && filteredTransactions.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
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
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
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
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
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
                        <span key={page} className="px-2 text-gray-500">
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
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
