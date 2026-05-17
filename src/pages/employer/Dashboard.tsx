import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Wallet,
  Briefcase,
  Send,
  CalendarSync,
  Star,
  Bell,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import dashboardApi from '../../api/dashboardApi';
import transactionApi, { Transaction } from '../../api/transactionApi';
import { useAuth } from '../../contexts/useAuth';

interface EmployerDashboardData {
  employees: {
    total_count: number;
    active_count: number;
    inactive_count: number;
  };
  contracts: {
    active_count: number;
    pending_proposals_count: number;
    completed_count: number;
    terminated_count: number;
  };
  suggestions: {
    pending_count: number;
    accepted_count: number;
    rejected_count: number;
  };
  payroll: {
    recent_payrolls: any[];
    this_month_total: number;
    employees_with_active_advances_count: number;
  };
  financial: {
    wallet_balance: string;
    recent_transactions: any[];
  };
  reviews: {
    average_rating: number;
    total_count: number;
  };
  notifications: {
    unread_count: number;
    recent: any[];
  };
}

// Extended Transaction interface for local use
interface LocalTransaction extends Omit<Transaction, 'amount' | 'user'> {
  reference_code?: string;
  amount: string | number;
  user?: {
    id: string | number;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
  };
}

const DashboardContent: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] =
    useState<EmployerDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<LocalTransaction[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dashboardApi.getDashboard();

        if (response.status) {
          setDashboardData(response.data);
        } else {
          setError(response.message || 'Failed to fetch dashboard data');
        }
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.message || 'Error loading dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Check if we're returning from a payment
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_success') === 'true') {
      // Refresh dashboard data after successful payment
      setTimeout(() => {
        fetchDashboardData();
      }, 1000);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Fetch transactions separately (same way as Transactions.tsx)
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const filters = {
          limit: 6,
          page: 1,
        };

        const response = await transactionApi.getTransactions(filters);

        if (response.status && response.data) {
          // Handle different possible response structures
          let txData: LocalTransaction[] = [];
          const data = response.data as any;

          if (data.transactions && Array.isArray(data.transactions)) {
            // If transactions array exists, map and transform
            txData = data.transactions.map((tx: Transaction) => ({
              ...tx,
              reference_code: tx.reference || tx.id?.toString(),
              amount:
                typeof tx.amount === 'string'
                  ? tx.amount
                  : tx.amount.toString(),
            }));
          } else if (data.data && Array.isArray(data.data)) {
            // Fallback to data array
            txData = data.data.map((tx: any) => ({
              ...tx,
              reference_code:
                tx.reference_code || tx.reference || tx.id?.toString(),
              amount:
                typeof tx.amount === 'string'
                  ? tx.amount
                  : tx.amount.toString(),
            }));
          } else if (Array.isArray(data)) {
            // If response.data itself is an array
            txData = data.map((tx: any) => ({
              ...tx,
              reference_code:
                tx.reference_code || tx.reference || tx.id?.toString(),
              amount:
                typeof tx.amount === 'string'
                  ? tx.amount
                  : tx.amount.toString(),
            }));
          }

          setTransactions(txData);
        } else {
          setTransactions([]);
        }
      } catch (error: any) {
        console.error('Error fetching transactions:', error);
        setTransactions([]);
      }
    };

    fetchTransactions();
  }, []);

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
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

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  // Prepare chart data
  const contractStatusData = [
    {
      name: 'Active',
      value: dashboardData.contracts.active_count,
      color: '#10b981',
    },
    {
      name: 'Pending',
      value: dashboardData.contracts.pending_proposals_count,
      color: '#f59e0b',
    },
    {
      name: 'Completed',
      value: dashboardData.contracts.completed_count,
      color: '#3b82f6',
    },
    {
      name: 'Terminated',
      value: dashboardData.contracts.terminated_count,
      color: '#ef4444',
    },
  ];

  const employeeStatusData = [
    {
      name: 'Active',
      value: dashboardData.employees.active_count,
      color: '#10b981',
    },
    {
      name: 'Inactive',
      value: dashboardData.employees.inactive_count,
      color: '#ef4444',
    },
  ];

  const isDarkMode =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark');
  const chartTooltipContentStyle = {
    backgroundColor: isDarkMode ? '#111827' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
    borderRadius: '12px',
    fontSize: '12px',
    color: isDarkMode ? '#e5e7eb' : '#111827',
    boxShadow: isDarkMode
      ? '0 10px 15px -3px rgb(0 0 0 / 0.35)'
      : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  };
  const chartTooltipLabelStyle = {
    color: isDarkMode ? '#e5e7eb' : '#111827',
  };
  const chartTooltipItemStyle = {
    color: isDarkMode ? '#e5e7eb' : '#111827',
  };
  const chartTooltipCursor = {
    fill: isDarkMode ? 'rgba(148, 163, 184, 0.14)' : 'rgba(59, 130, 246, 0.08)',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Welcome Section */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome Back, {user?.name || 'User'}
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Employer Dashboard Overview
            </p>
          </div>
          <div className="bg-[#EFAE73] text-gray-900 dark:text-gray-100 h-[42px] w-full sm:w-[165px] flex justify-center items-center px-4 py-1 rounded-full text-sm">
            Ruby Subscription
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {/* Wallet Balance Card */}
        <div className="bg-[#174B35] text-white p-4 sm:p-6 rounded-2xl shadow-lg relative overflow-hidden">
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
            </svg>
          </div>
          <div className="mb-4 sm:mb-6 relative z-10">
            <p className="text-white/80 text-sm mb-2">Current Balance</p>
            <h2 className="text-xl sm:text-2xl font-semibold">
              {formatCurrency(dashboardData.financial.wallet_balance)}
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 relative z-10">
            <Link to="/employer/wallet/top-up">
              <button className="bg-white dark:bg-gray-800 hover:bg-green-600 text-[#246D51] h-[42px] w-full sm:w-auto py-2 px-4 rounded flex items-center justify-center gap-2 text-sm cursor-pointer">
                <TrendingUp size={12} />
                Top-up
              </button>
            </Link>
            <Link to="/employer/wallet">
              <button className="bg-white dark:bg-gray-800 text-green-800 h-[42px] w-full sm:w-auto py-2 px-4 rounded flex items-center justify-center gap-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                <Wallet size={12} />
                Withdraw
              </button>
            </Link>
          </div>
        </div>

        {/* Staff Count Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Staff
            </span>
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {dashboardData.employees.total_count}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {dashboardData.employees.active_count} active
          </div>
        </div>

        {/* Active Contracts Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Active Contracts
            </span>
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {dashboardData.contracts.active_count}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {dashboardData.contracts.pending_proposals_count} pending
          </div>
        </div>

        {/* Total Payroll Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Monthly Payroll
            </span>
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {formatCurrency(dashboardData.payroll.this_month_total)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            This month
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Contract Status */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Contract Status
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                By status
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={contractStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {contractStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={chartTooltipContentStyle}
                labelStyle={chartTooltipLabelStyle}
                itemStyle={chartTooltipItemStyle}
                cursor={chartTooltipCursor}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ fontSize: '11px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Employee Status */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Employee Status
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Active vs Inactive
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={employeeStatusData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f3f4f6"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#9ca3af"
                style={{ fontSize: '11px' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: '11px' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={chartTooltipContentStyle}
                labelStyle={chartTooltipLabelStyle}
                itemStyle={chartTooltipItemStyle}
                cursor={chartTooltipCursor}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                {employeeStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Payroll */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Recent Payroll
              </h2>
            </div>
            <button
              onClick={() => navigate('/employer/payroll')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {dashboardData.payroll.recent_payrolls
              .slice(0, 5)
              .map((payroll: any) => (
                <div
                  key={payroll.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Payroll #{payroll.id}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {payroll.employees_count || 0} employees •{' '}
                        {formatDate(payroll.payment_date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(payroll.total_amount)}
                    </p>
                    <span
                      className={`text-xs ${
                        payroll.status === 'completed'
                          ? 'text-green-600'
                          : 'text-orange-600'
                      }`}
                    >
                      {payroll.status}
                    </span>
                  </div>
                </div>
              ))}
            {dashboardData.payroll.recent_payrolls.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No recent payroll records
              </p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-green-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Recent Transactions
              </h2>
            </div>
            <button
              onClick={() => navigate('/employer/transactions')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {dashboardData.financial.recent_transactions
              .slice(0, 5)
              .map((transaction: any) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        transaction.type === 'credit'
                          ? 'bg-green-50'
                          : 'bg-red-50'
                      }`}
                    >
                      {transaction.type === 'credit' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {transaction.description || transaction.source}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {formatTime(transaction.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p
                      className={`text-sm font-semibold ${
                        transaction.type === 'credit'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              ))}
            {dashboardData.financial.recent_transactions.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No recent transactions
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Pending Suggestions
            </div>
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <Send className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {dashboardData.suggestions.pending_count}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Active Advances
            </div>
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <CalendarSync className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {dashboardData.payroll.employees_with_active_advances_count}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Average Rating
            </div>
            <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-yellow-600" />
            </div>
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {dashboardData.reviews.average_rating.toFixed(1) || '0.0'}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Unread Notifications
            </div>
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {dashboardData.notifications.unread_count}
          </div>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Transaction History
            </h2>
          </div>
          <button
            onClick={() => navigate('/employer/transactions')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
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
                  Payment Method
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100">
              {transactions.length > 0 ? (
                transactions.slice(0, 6).map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
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
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-mono">
                      {transaction.reference_code ||
                        transaction.reference ||
                        'N/A'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {format(new Date(transaction.created_at), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <span className="capitalize">
                        {transaction.payment_method?.replace('_', ' ') || 'N/A'}
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 sm:px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <CreditCard className="w-12 h-12 text-gray-300" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          No transactions found
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Transactions will appear here once they are processed
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
