import { useEffect, useState, useRef } from 'react';
import {
  Search,
  MoreVertical,
  User,
  Shield,
  ShieldOff,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import Avatar from '../../../components/common/Avatar';
import Toast from '../../../components/common/Toast';

interface Employer {
  id: number;
  first_name: string;
  last_name: string;
  title: string;
  username: string | null;
  email: string;
  email_verified_at: string;
  avatar: string;
  gender: string;
  dob: string;
  phone: string;
  address: string;
  status: number;
  is_verified: number;
  is_blocked: boolean;
  salary: string;
  profile_description: string | null;
  created_at: string;
  updated_at: string;
}

export default function EmployersTab() {
  const navigate = useNavigate();
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [filteredEmployers, setFilteredEmployers] = useState<Employer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOptionsFor, setShowOptionsFor] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [blockedFilter, setBlockedFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  // Filter employers based on search and filters
  useEffect(() => {
    let filtered = [...employers];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query) ||
          emp.phone?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((emp) => {
        if (statusFilter === 'verified') return emp.is_verified === 1;
        if (statusFilter === 'unverified') return emp.is_verified === 0;
        return true;
      });
    }

    // Blocked filter
    if (blockedFilter !== 'all') {
      filtered = filtered.filter((emp) => {
        if (blockedFilter === 'blocked') return emp.is_blocked === true;
        if (blockedFilter === 'active') return emp.is_blocked === false;
        return true;
      });
    }

    setFilteredEmployers(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [employers, searchQuery, statusFilter, blockedFilter]);

  // Get paginated employers
  const getPaginatedEmployers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEmployers.slice(startIndex, endIndex);
  };

  const handleBlockUser = async (userId: number) => {
    try {
      const response = await adminApi.blockUser(userId);
      if (response.status) {
        showToast('User blocked successfully', 'success');
        setEmployers(
          employers.map((emp) =>
            emp.id === userId ? { ...emp, is_blocked: true } : emp
          )
        );
        setShowOptionsFor(null);
      } else {
        showToast(response.message || 'Failed to block user', 'error');
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      showToast('An error occurred while blocking the user', 'error');
    }
  };

  const handleUnblockUser = async (userId: number) => {
    try {
      const response = await adminApi.unblockUser(userId);
      if (response.status) {
        showToast('User unblocked successfully', 'success');
        setEmployers(
          employers.map((emp) =>
            emp.id === userId ? { ...emp, is_blocked: false } : emp
          )
        );
        setShowOptionsFor(null);
      } else {
        showToast(response.message || 'Failed to unblock user', 'error');
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      showToast('An error occurred while unblocking the user', 'error');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setBlockedFilter('all');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    blockedFilter !== 'all';

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use a larger limit to ensure we get all employers
        const response = await adminApi.getEmployerList(1, 100);
        console.log('Employers API Response:', response); // Debug log

        if (response.status) {
          // Handle the new paginated response structure
          const employerData = response.data?.data || response.data || [];
          console.log('Extracted employer data:', employerData); // Debug log
          setEmployers(employerData);
        } else {
          const errorMessage = response.message || 'Failed to fetch employers';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        }
      } catch (err) {
        const errorMessage = 'Error fetching employers';
        setError(errorMessage);
        showToast(errorMessage, 'error');
        console.error('Error fetching employers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployers();
  }, []);

  return (
    <div>
      {/* Search and Filters Section */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm appearance-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>

          {/* Blocked Filter */}
          <div className="relative">
            <select
              value={blockedFilter}
              onChange={(e) => setBlockedFilter(e.target.value)}
              className="pl-4 pr-8 py-2.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm appearance-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Showing {filteredEmployers.length} of {employers.length} employers
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-border-default dark:border-gray-700">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Employer
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Date Joined
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Blocked
              </th>
              <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-border-default dark:divide-gray-700">
            {isLoading ? (
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
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Please try refreshing the page
                    </p>
                  </div>
                </td>
              </tr>
            ) : filteredEmployers.length === 0 ? (
              // Empty state
              <tr>
                <td
                  colSpan={8}
                  className="px-4 sm:px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Users className="w-12 h-12 text-gray-300" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {hasActiveFilters
                          ? 'No employers match your filters'
                          : 'No employers found'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {hasActiveFilters
                          ? 'Try adjusting your search or filters'
                          : 'Employers will appear here once they register'}
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
              getPaginatedEmployers().map((employer) => (
                <tr
                  key={employer.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={employer.avatar}
                        firstName={employer.first_name}
                        lastName={employer.last_name}
                        size="sm"
                        showStatus={false}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {`${employer.first_name} ${employer.last_name}`}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">
                          {employer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {new Date(employer.created_at).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {employer.address
                      ? employer.address.split(',')[0]
                      : 'Lagos'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {employer.gender.charAt(0).toUpperCase() +
                      employer.gender.slice(1)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {employer.phone}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        employer.is_verified === 0
                          ? 'bg-red-50 text-red-700'
                          : 'bg-green-50 text-green-700'
                      }`}
                    >
                      {employer.is_verified === 0 ? 'Unverified' : 'Verified'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        employer.is_blocked
                          ? 'bg-red-50 text-red-700'
                          : 'bg-green-50 text-green-700'
                      }`}
                    >
                      {employer.is_blocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() =>
                          setShowOptionsFor(
                            showOptionsFor === employer.id ? null : employer.id
                          )
                        }
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {showOptionsFor === employer.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border-default dark:border-gray-700 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                navigate(`/admin/user/${employer.id}`);
                                setShowOptionsFor(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                              <User className="w-4 h-4" />
                              View Profile
                            </button>
                            <button
                              onClick={() => {
                                if (employer.is_blocked) {
                                  handleUnblockUser(employer.id);
                                } else {
                                  handleBlockUser(employer.id);
                                }
                              }}
                              className={`w-full px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 ${
                                employer.is_blocked
                                  ? 'text-green-700'
                                  : 'text-red-700'
                              }`}
                            >
                              {employer.is_blocked ? (
                                <>
                                  <Shield className="w-4 h-4" />
                                  Unblock User
                                </>
                              ) : (
                                <>
                                  <ShieldOff className="w-4 h-4" />
                                  Block User
                                </>
                              )}
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
      {!isLoading && !error && filteredEmployers.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing{' '}
            <span className="font-medium">
              {Math.min(
                (currentPage - 1) * itemsPerPage + 1,
                filteredEmployers.length
              )}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredEmployers.length)}
            </span>{' '}
            of <span className="font-medium">{filteredEmployers.length}</span>{' '}
            results
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border transition-colors ${
                currentPage === 1
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
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
                        : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
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
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border transition-colors ${
                currentPage === totalPages
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
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
}
