import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  BookOpen,
  Briefcase,
  Wallet,
  Eye,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Star,
  Bell,
  Shield,
  User,
  Award,
  Play,
  ArrowRight,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import dashboardApi from '../../api/dashboardApi';
import transactionApi, { Transaction } from '../../api/transactionApi';
import { useAuth } from '../../contexts/useAuth';

interface EmployeeDashboardData {
  profile: {
    kyc_status: string;
    profile_complete: boolean;
    average_rating: number;
    total_reviews: number;
  };
  employment: {
    active_contracts_count: number;
    pending_proposals_count: number;
    total_contracts_count: number;
    is_employed: boolean;
  };
  financial: {
    wallet_balance: string;
    recent_transactions: any[];
    has_active_salary_advance: boolean;
    pending_salary_advance_requests_count: number;
    current_salary: string;
    last_salary_update: string | null;
  };
  notifications: {
    unread_count: number;
    recent: any[];
  };
  learning: {
    recommended_resources_count: number;
    recent_resources: any[];
  };
}

const DashboardContent: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] =
    useState<EmployeeDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

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
  }, []);

  // Fetch transactions separately (same way as employer Dashboard.tsx)
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
          let txData: any[] = [];
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
      return 'bg-green-50 text-green-700 border border-green-200';
    } else if (statusLower === 'pending') {
      return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    } else {
      return 'bg-red-50 text-red-700 border border-red-200';
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
  const employmentStatusData = [
    {
      name: 'Active',
      value: dashboardData.employment.active_contracts_count,
      color: '#10b981',
    },
    {
      name: 'Pending',
      value: dashboardData.employment.pending_proposals_count,
      color: '#f59e0b',
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
    <div className="p-0">
      {/* Welcome Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Welcome Back, {user?.name || 'User'}
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Employee Dashboard Overview
        </p>
      </div>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {/* Salary Card */}
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
            <p className="text-white/80 text-sm mb-2">Monthly Salary</p>
            <h2 className="text-xl sm:text-2xl font-semibold">
              {dashboardData.financial.current_salary
                ? formatCurrency(dashboardData.financial.current_salary)
                : '₦ 0.00'}
            </h2>
          </div>
          <div className="flex gap-4 relative z-10">
            <Link to="/employee/salary">
              <button className="bg-white dark:bg-gray-800 text-[#246D51] h-[42px] py-2 px-3 sm:px-4 rounded flex items-center gap-2 text-sm">
                <Eye size={12} />
                <span className="hidden sm:inline">View Details</span>
                <span className="sm:hidden">View</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Wallet Balance
            </span>
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {dashboardData.financial.wallet_balance
              ? formatCurrency(dashboardData.financial.wallet_balance)
              : '₦ 0.00'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Available balance
          </div>
        </div>

        {/* Educational Resources Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Educational Resources
            </span>
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {dashboardData.learning.recommended_resources_count}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Recommended for you
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Employment Status */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Employment Status
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Contracts & Proposals
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={employmentStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {employmentStatusData.map((entry, index) => (
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

        {/* Profile & Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Profile & Performance
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Your profile status
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {/* KYC Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    dashboardData.profile.kyc_status === 'verified'
                      ? 'bg-green-50'
                      : 'bg-yellow-50'
                  }`}
                >
                  <Shield
                    className={`w-5 h-5 ${
                      dashboardData.profile.kyc_status === 'verified'
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    KYC Status
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {dashboardData.profile.kyc_status === 'verified'
                      ? 'Verified'
                      : 'Not Verified'}
                  </p>
                </div>
              </div>
              {dashboardData.profile.kyc_status === 'verified' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Link
                  to="/employee/kyc"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Verify →
                </Link>
              )}
            </div>

            {/* Profile Completion */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    dashboardData.profile.profile_complete
                      ? 'bg-blue-50'
                      : 'bg-orange-50'
                  }`}
                >
                  <User
                    className={`w-5 h-5 ${
                      dashboardData.profile.profile_complete
                        ? 'text-blue-600'
                        : 'text-orange-600'
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Profile Completion
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {dashboardData.profile.profile_complete
                      ? 'Complete'
                      : 'Incomplete'}
                  </p>
                </div>
              </div>
              {dashboardData.profile.profile_complete ? (
                <CheckCircle className="w-5 h-5 text-blue-600" />
              ) : (
                <Link
                  to="/employee/profile"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Complete →
                </Link>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-br from-yellow-50 to-white rounded-lg border border-yellow-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Average Rating
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {dashboardData.profile.total_reviews} review
                    {dashboardData.profile.total_reviews !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {dashboardData.profile.average_rating.toFixed(1) || '0.0'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Learning Resources */}
      {dashboardData.learning.recent_resources.length > 0 && (
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Recent Learning Resources
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Recommended for your occupation
                  </p>
                </div>
              </div>
              <Link
                to="/employee/resources"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.learning.recent_resources
                .slice(0, 3)
                .map((resource: any) => (
                  <div
                    key={resource.id}
                    className="bg-gradient-to-br from-indigo-50 to-white rounded-lg p-4 border border-indigo-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Play className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-indigo-600">
                            Video Resource
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                      {resource.description || 'Learning Resource'}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(resource.created_at), 'MMM dd, yyyy')}
                      </span>
                      <Link
                        to="/employee/resources"
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                      >
                        Watch
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
              KYC Status
            </span>
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <CheckCircle
                className={`w-4 h-4 ${
                  dashboardData.profile.kyc_status === 'verified'
                    ? 'text-green-600'
                    : 'text-orange-600'
                }`}
              />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
            {dashboardData.profile.kyc_status === 'verified' ? (
              <span className="text-green-600">Verified</span>
            ) : (
              <span className="text-orange-600">Pending</span>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
              Active Contracts
            </span>
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
            {dashboardData.employment.active_contracts_count}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
              Average Rating
            </span>
            <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-yellow-600" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
            {dashboardData.profile.average_rating
              ? dashboardData.profile.average_rating.toFixed(1)
              : '0.0'}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
              Unread Notifications
            </span>
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
            {dashboardData.notifications.unread_count}
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="mt-8">
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
              onClick={() => navigate('/employee/transactions')}
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
                        {format(
                          new Date(transaction.created_at),
                          'MMM dd, yyyy'
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
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
                            Transactions will appear here once they are
                            processed
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
    </div>
  );
};

export default DashboardContent;
