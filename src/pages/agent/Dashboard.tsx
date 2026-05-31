import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Users,
  CreditCard,
  TrendingUp,
  FileText,
  DollarSign,
  UserCheck,
  UserX,
  Send,
  Star,
  Briefcase,
  Clock,
} from 'lucide-react';
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
import { useAuth } from '../../contexts/useAuth';

interface AgentDashboardData {
  registered_employees: {
    total_count: number;
    verified_count: number;
    unverified_count: number;
  };
  placements: {
    active_count: number;
    inactive_count: number;
    total_count: number;
  };
  suggestions: {
    total_count: number;
    pending_count: number;
    accepted_count: number;
    rejected_count: number;
  };
  contracts: {
    employees_with_active_contracts_count: number;
    employees_with_pending_contracts_count: number;
  };
  reviews: {
    average_rating: number;
    total_count: number;
  };
  financial: {
    wallet_balance: string;
    recent_transactions: any[];
  };
  notifications: {
    unread_count: number;
    recent: any[];
  };
  activity: {
    recent_registrations: any[];
    recent_placements: any[];
  };
}

export default function AgentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<AgentDashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    fetchDashboardData();
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
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
  const placementData = [
    {
      name: 'Active',
      value: dashboardData.placements.active_count,
      color: '#10b981',
    },
    {
      name: 'Inactive',
      value: dashboardData.placements.inactive_count,
      color: '#ef4444',
    },
  ];

  const suggestionStatusData = [
    {
      name: 'Accepted',
      value: dashboardData.suggestions.accepted_count,
      color: '#10b981',
    },
    {
      name: 'Pending',
      value: dashboardData.suggestions.pending_count,
      color: '#f59e0b',
    },
    {
      name: 'Rejected',
      value: dashboardData.suggestions.rejected_count,
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
    <div>
      {/* Welcome Section */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome Back, {user?.name || 'Agent'}
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Agent Dashboard Overview
            </p>
          </div>
          <button className="bg-[#EFAE73] h-[36px] sm:h-[42px] text-[14px] sm:text-[16px] text-gray-900 dark:text-gray-100 px-3 sm:px-4 py-2 w-[140px] sm:w-[165px] rounded-[59px]">
            <span className="hidden sm:inline">Ruby Subscription</span>
            <span className="sm:hidden">Ruby Sub</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <div className="bg-surface rounded-2xl p-4 sm:p-6 border border-border-default shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Candidates
            </span>
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {dashboardData.registered_employees.total_count.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {dashboardData.registered_employees.verified_count} verified
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4 sm:p-6 border border-border-default shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              On Placement
            </span>
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {dashboardData.placements.active_count.toLocaleString()}
          </div>
          <div className="text-xs text-green-600 font-medium">
            {dashboardData.placements.total_count} total placements
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4 sm:p-6 border border-border-default shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Terminated
            </span>
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <UserX className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {dashboardData.placements.inactive_count.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Inactive placements
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4 sm:p-6 border border-border-default shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Wallet Balance
            </span>
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {formatCurrency(dashboardData.financial.wallet_balance)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Available balance
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Placement Status */}
        <div className="bg-surface rounded-2xl p-4 sm:p-6 border border-border-default shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Placement Status
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Active vs Inactive
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={placementData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {placementData.map((entry, index) => (
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

        {/* Suggestions Status */}
        <div className="bg-surface rounded-2xl p-4 sm:p-6 border border-border-default shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Suggestions Status
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                By status
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={suggestionStatusData}>
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
                {suggestionStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Registrations */}
        <div className="bg-surface rounded-2xl p-4 sm:p-6 border border-border-default shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-indigo-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Recent Registrations
              </h2>
            </div>
            <button
              onClick={() => navigate('/agent/all-candidates')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {dashboardData.activity.recent_registrations
              .slice(0, 5)
              .map((registration: any) => (
                <div
                  key={registration.id}
                  className="flex items-center justify-between p-3 hover:bg-elevated/50 rounded-lg transition"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {registration.name || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {registration.email || 'N/A'} •{' '}
                        {formatDate(registration.registered_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        registration.status === 'verified'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-orange-50 text-orange-700'
                      }`}
                    >
                      {registration.status || 'Unverified'}
                    </span>
                  </div>
                </div>
              ))}
            {dashboardData.activity.recent_registrations.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No recent registrations
              </p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-surface rounded-2xl p-4 sm:p-6 border border-border-default shadow-sm">
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
              onClick={() => navigate('/agent/wallet')}
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
                  className="flex items-center justify-between p-3 hover:bg-elevated/50 rounded-lg transition"
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
        <div className="bg-surface rounded-xl p-4 border border-border-default shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Verified Candidates
            </div>
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {dashboardData.registered_employees.verified_count}
          </div>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-border-default shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Total Suggestions
            </div>
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <Send className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {dashboardData.suggestions.total_count}
          </div>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-border-default shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Active Contracts
            </div>
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {dashboardData.contracts.employees_with_active_contracts_count}
          </div>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-border-default shadow-sm">
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
      </div>

      {/* Candidates Table */}
      <div className="bg-surface rounded-2xl p-4 sm:p-6 border border-border-default shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Candidates
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Recent candidate activity
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/agent/all-candidates')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-elevated border-b border-border-default">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Placement
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border-default">
              {dashboardData.activity.recent_registrations.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 sm:px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Users className="w-12 h-12 text-gray-300" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          No candidates found
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Candidates will appear here once they register
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                dashboardData.activity.recent_registrations
                  .slice(0, 5)
                  .map((registration: any) => (
                    <tr
                      key={registration.id}
                      className="hover:bg-elevated/50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {registration.name || 'N/A'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(registration.registered_at)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {registration.placement || 'Not on placement'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                            registration.status === 'verified'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-orange-50 text-orange-700 border-orange-200'
                          }`}
                        >
                          {registration.status === 'verified' ? (
                            <UserCheck className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {registration.status
                            ? registration.status.charAt(0).toUpperCase() +
                              registration.status.slice(1)
                            : 'Unverified'}
                        </span>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
