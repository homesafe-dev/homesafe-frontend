import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  Phone,
  Calendar,
  User,
  Briefcase,
} from 'lucide-react';
import adminApi from '../../api/adminApi';
import Avatar from '../../components/common/Avatar';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  phone: string;
  // Fields that might be different between user types
  created_at?: string;
  address?: string;
  gender?: string;
  is_verified?: number;
  status?: string;
  total_employees?: number;
  average_rating?: number | null;
  total_reviews?: number;
}

const AllCandidatesPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('employers');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        let response;

        // Fetch data based on active tab
        if (activeTab === 'employers') {
          response = await adminApi.getEmployerList(currentPage);
        } else if (activeTab === 'agents') {
          response = await adminApi.getAgentList(currentPage);
        } else {
          response = await adminApi.getEmployeeList(currentPage);
        }

        if (response.status) {
          // Handle different response structures
          const userData = response.data.data || response.data || [];
          setUsers(userData);
          setFilteredUsers(userData);

          // If there's pagination info in the response, update totalPages
          if (response.data.meta && response.data.meta.last_page) {
            setTotalPages(response.data.meta.last_page);
          } else if (response.meta && response.meta.last_page) {
            setTotalPages(response.meta.last_page);
          } else {
            setTotalPages(Math.ceil(userData.length / 10) || 1);
          }
        } else {
          setError(response.message || `Failed to fetch ${activeTab}`);
        }
      } catch (err: any) {
        setError(`Error fetching ${activeTab}`);
        console.error(`Error fetching ${activeTab}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [activeTab, currentPage]);

  // Filter users based on search and status
  useEffect(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          `${user.first_name} ${user.last_name}`
            .toLowerCase()
            .includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.phone?.toLowerCase().includes(query) ||
          user.address?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((user) => {
        if (activeTab === 'agents') {
          if (statusFilter === 'verified')
            return user.status !== 'not verified';
          if (statusFilter === 'unverified')
            return user.status === 'not verified';
        } else {
          if (statusFilter === 'verified') return user.is_verified === 1;
          if (statusFilter === 'unverified') return user.is_verified === 0;
        }
        return true;
      });
    }

    setFilteredUsers(filtered);
  }, [searchQuery, statusFilter, users, activeTab]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || statusFilter !== 'all';

  return (
    <div className="p-0">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Candidates
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              View and manage all candidates in the system
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-border-default">
        {/* Tabs */}
        <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-border-default">
          <div className="flex flex-wrap gap-2 sm:gap-0 sm:space-x-1">
            <button
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'employers'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => {
                setActiveTab('employers');
                setCurrentPage(1);
              }}
            >
              Employers
            </button>
            <button
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'agents'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => {
                setActiveTab('agents');
                setCurrentPage(1);
              }}
            >
              Agents
            </button>
            <button
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'employees'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => {
                setActiveTab('employees');
                setCurrentPage(1);
              }}
            >
              Employees
            </button>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="p-4 sm:p-6 border-b border-border-default">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-border-default">
            <p className="text-sm text-gray-600">
              Showing{' '}
              <span className="font-semibold text-gray-900">
                {filteredUsers.length}
              </span>{' '}
              {filteredUsers.length === 1 ? 'candidate' : 'candidates'}
              {hasActiveFilters && ' (filtered)'}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-elevated border-b border-border-default">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {activeTab === 'agents' ? 'Total Employees' : 'Gender'}
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border-default">
              {isLoading ? (
                // Loading state
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
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
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={7} className="px-4 sm:px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No {activeTab} found
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {hasActiveFilters
                          ? 'Try adjusting your filters or search query'
                          : `No ${activeTab} have been registered yet`}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                // Data rows
                filteredUsers.map((user) => {
                  const isVerified =
                    activeTab === 'agents'
                      ? user.status !== 'not verified'
                      : user.is_verified === 1;
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={user.avatar}
                            firstName={user.first_name}
                            lastName={user.last_name}
                            size="sm"
                            showStatus={false}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {`${user.first_name} ${user.last_name}`}
                            </div>
                            {user.email && (
                              <div className="text-xs text-gray-500">
                                {user.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString(
                                'en-US',
                                {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                }
                              )
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {user.address ? user.address.split(',')[0] : 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {activeTab === 'agents' ? (
                          <div className="flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            {user.total_employees !== undefined
                              ? `${user.total_employees} employees`
                              : 'N/A'}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4 text-gray-400" />
                            {user.gender
                              ? user.gender.charAt(0).toUpperCase() +
                                user.gender.slice(1)
                              : 'N/A'}
                          </div>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {user.phone || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                            isVerified
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => navigate(`/admin/user/${user.id}`)}
                          className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-700 font-medium transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && filteredUsers.length > 0 && totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-border-default flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing{' '}
              <span className="font-medium">{(currentPage - 1) * 10 + 1}</span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(currentPage * 10, filteredUsers.length)}
              </span>{' '}
              of <span className="font-medium">{filteredUsers.length}</span>{' '}
              results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-green-600 text-white'
                            : 'border border-gray-200 hover:bg-gray-50'
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
                      <span key={page} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCandidatesPage;
