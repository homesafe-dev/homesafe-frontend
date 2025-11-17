import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Users,
  CreditCard,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle,
  Bell,
  UserCheck,
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
  LineChart,
  Line,
} from 'recharts';
import dashboardApi from '../../api/dashboardApi';
import { useAuth } from '../../contexts/useAuth';
// Tab components
import DashboardEmployersTab from './tabs/dashboard/DashboardEmployersTab';
import DashboardAgentsTab from './tabs/dashboard/DashboardAgentsTab';
import DashboardEmployeesTab from './tabs/dashboard/DashboardEmployeesTab';

interface AdminDashboardData {
  users: {
    total_count: number;
    by_role: {
      admin: number;
      agent: number;
      employer: number;
      employee: number;
    };
    active_count: number;
    inactive_count: number;
    verified_count: number;
    unverified_count: number;
  };
  approvals: {
    pending_count: number;
    approved_today: number;
    approved_this_week: number;
    approved_this_month: number;
    declined_count: number;
  };
  user_management?: {
    blocked_count: number;
    unblocked_count: number;
  };
  employment?: {
    active_contracts_count: number;
    pending_contracts_count: number;
    terminated_contracts_count: number;
    total_suggestions_count: number;
  };
  financial: {
    total_transactions_count: number;
    total_transaction_volume: number;
    total_wallet_balance: string;
    recent_transactions: any[];
  };
  reviews?: {
    total_count: number;
    average_rating: number;
    rating_distribution: Record<string, number>;
  };
  activity: {
    recent_logs: any[];
    new_registrations_today: number;
    new_registrations_this_week: number;
    new_registrations_this_month: number;
    active_contracts_this_month?: number;
    completed_contracts_this_month?: number;
    registration_trend?: Array<{
      month: string;
      count: number;
    }>;
  };
  notifications: {
    unread_count: number;
  };
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('employers');

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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
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
  const userRoleData = [
    {
      name: 'Employees',
      value: dashboardData.users.by_role.employee,
      color: '#3b82f6',
    },
    {
      name: 'Employers',
      value: dashboardData.users.by_role.employer,
      color: '#8b5cf6',
    },
    {
      name: 'Agents',
      value: dashboardData.users.by_role.agent,
      color: '#f59e0b',
    },
    {
      name: 'Admins',
      value: dashboardData.users.by_role.admin,
      color: '#10b981',
    },
  ];

  // Registration trend - using real API data
  const registrationTrend =
    dashboardData.activity.registration_trend?.map((item) => ({
      month: item.month,
      registrations: item.count,
    })) || [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Welcome Section */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome Back, {user?.name || 'Admin'}
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              System Overview & Analytics
            </p>
          </div>
          <button className="bg-[#EFAE73] h-[42px] text-[14px] sm:text-[16px] text-[#24292E] px-3 sm:px-4 py-2 w-[140px] sm:w-[165px] rounded-[59px]">
            Admin Dashboard
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Total Users
            </span>
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {dashboardData.users.total_count.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            {dashboardData.users.active_count} active
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Pending Approvals
            </span>
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {dashboardData.approvals.pending_count}
          </div>
          <div className="text-xs text-orange-600 font-medium">
            Requires attention
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Total Transactions
            </span>
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {dashboardData.financial.total_transactions_count.toLocaleString()}
          </div>
          <div className="text-xs text-green-600 font-medium">
            {formatCurrency(dashboardData.financial.total_transaction_volume)}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Wallet Balance
            </span>
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(dashboardData.financial.total_wallet_balance)}
          </div>
          <div className="text-xs text-gray-500">Platform total</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Distribution */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                User Distribution
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Breakdown by role</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={userRoleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userRoleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ fontSize: '11px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Registration Trend */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Registration Trend
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Last {registrationTrend.length} months performance
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={registrationTrend}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f3f4f6"
                vertical={false}
              />
              <XAxis
                dataKey="month"
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
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="registrations"
                stroke="#3b82f6"
                strokeWidth={2}
                name="New Registrations"
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Activity Logs */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-indigo-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">
                Recent Activity
              </h2>
            </div>
            <button
              onClick={() => navigate('/admin/transactions')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {dashboardData.activity.recent_logs.slice(0, 5).map((log: any) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {log.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {log.user?.name || 'System'} • {formatTime(log.created_at)}
                  </p>
                </div>
              </div>
            ))}
            {dashboardData.activity.recent_logs.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No recent activity
              </p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-green-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">
                Recent Transactions
              </h2>
            </div>
            <button
              onClick={() => navigate('/admin/transactions')}
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
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
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
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {transaction.description || transaction.source}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {transaction.user?.name || 'N/A'} •{' '}
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
              <p className="text-sm text-gray-500 text-center py-4">
                No recent transactions
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500">Verified Users</div>
            <div className="w-6 h-6 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
            </div>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {dashboardData.users.verified_count}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500">Approved This Month</div>
            <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            </div>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {dashboardData.approvals.approved_this_month}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500">New This Week</div>
            <div className="w-6 h-6 bg-purple-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
            </div>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {dashboardData.activity.new_registrations_this_week}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500">Unread Notifications</div>
            <div className="w-6 h-6 bg-orange-50 rounded-lg flex items-center justify-center">
              <Bell className="w-3.5 h-3.5 text-orange-600" />
            </div>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {dashboardData.notifications.unread_count}
          </div>
        </div>
      </div>

      {/* Activities Section with Tabs */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Activities
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                View all candidates in the system
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/all-candidates')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 sm:gap-0 sm:space-x-1">
            <button
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'employers'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('employers')}
            >
              Employers
            </button>
            <button
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'agents'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('agents')}
            >
              Agents
            </button>
            <button
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'employees'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('employees')}
            >
              Employees
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'employers' && <DashboardEmployersTab />}
          {activeTab === 'agents' && <DashboardAgentsTab />}
          {activeTab === 'employees' && <DashboardEmployeesTab />}
        </div>
      </div>
    </div>
  );
}
