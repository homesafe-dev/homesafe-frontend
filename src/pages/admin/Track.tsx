import { useState, useEffect, useRef } from 'react';
import {
  Search,
  MoreVertical,
  User,
  Shield,
  ShieldOff,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import Avatar from '../../components/common/Avatar';
import Toast from '../../components/common/Toast';

interface Employee {
  id: number;
  candidate: string | null;
  title: string | null;
  email: string;
  avatar: string | null;
  date: string;
  placement: string | null;
  gender: string | null;
  phone: string | null;
  is_verified: number;
  approval_status: string;
  is_blocked?: boolean;
  status: string;
}

const AdminTrack = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
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

  // Helper function to safely format gender
  const formatGender = (gender: string | null): string => {
    if (!gender || typeof gender !== 'string') return 'N/A';
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  // Helper function to get employee status
  const getEmployeeStatus = (
    employee: Employee
  ): { text: string; style: string } => {
    if (employee.is_verified === 1) {
      return { text: 'Verified', style: 'bg-green-50 text-green-700' };
    } else {
      return { text: 'Unverified', style: 'bg-red-50 text-red-700' };
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await adminApi.getTrackedEmployees(1, 100);

        if (response.status) {
          const employeeData = response.data || [];
          setEmployees(employeeData);
          setFilteredEmployees(employeeData);
          setTotalPages(Math.ceil(employeeData.length / itemsPerPage));
        } else {
          const errorMessage = response.message || 'Failed to fetch employees';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        }
      } catch (err: any) {
        const errorMessage = 'Error fetching employees';
        setError(errorMessage);
        showToast(errorMessage, 'error');
        console.error('Error fetching employees:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter and search employees
  useEffect(() => {
    let filtered = [...employees];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.candidate?.toLowerCase().includes(query) ||
          emp.email?.toLowerCase().includes(query) ||
          emp.phone?.toLowerCase().includes(query) ||
          emp.placement?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((emp) => {
        if (statusFilter === 'verified') return emp.is_verified === 1;
        if (statusFilter === 'unverified') return emp.is_verified !== 1;
        return true;
      });
    }

    // Apply blocked filter
    if (blockedFilter !== 'all') {
      filtered = filtered.filter((emp) => {
        if (blockedFilter === 'blocked') return emp.is_blocked === true;
        if (blockedFilter === 'active') return !emp.is_blocked;
        return true;
      });
    }

    setFilteredEmployees(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [searchQuery, statusFilter, blockedFilter, employees]);

  // Handle click outside dropdown
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

  // Get paginated employees
  const getPaginatedEmployees = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEmployees.slice(startIndex, endIndex);
  };

  const toggleOptions = (id: number) => {
    if (showOptionsFor === id) {
      setShowOptionsFor(null);
    } else {
      setShowOptionsFor(id);
    }
  };

  const handleBlockUser = async (userId: number) => {
    try {
      const response = await adminApi.blockUser(userId);
      if (response.status) {
        showToast('User blocked successfully', 'success');
        setEmployees(
          employees.map((emp) =>
            emp.id === userId ? { ...emp, is_blocked: true } : emp
          )
        );
      } else {
        showToast(response.message || 'Failed to block user', 'error');
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      showToast('An error occurred while blocking the user', 'error');
    }
    setShowOptionsFor(null);
  };

  const handleUnblockUser = async (userId: number) => {
    try {
      const response = await adminApi.unblockUser(userId);
      if (response.status) {
        showToast('User unblocked successfully', 'success');
        setEmployees(
          employees.map((emp) =>
            emp.id === userId ? { ...emp, is_blocked: false } : emp
          )
        );
      } else {
        showToast(response.message || 'Failed to unblock user', 'error');
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      showToast('An error occurred while unblocking the user', 'error');
    }
    setShowOptionsFor(null);
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

  return (
    <div className="p-0">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Track Employees
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Manage and monitor all tracked employees
        </p>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or placement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>

            {/* Blocked Filter */}
            <select
              value={blockedFilter}
              onChange={(e) => setBlockedFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm flex items-center gap-2 text-gray-700 dark:text-gray-200"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Showing{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {filteredEmployees.length}
            </span>{' '}
            {filteredEmployees.length === 1 ? 'employee' : 'employees'}
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-500/30 text-sm">
          {error}
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-100 dark:border-slate-500">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-100 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-100 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-100 uppercase tracking-wider">
                  Placement
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-100 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-100 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-100 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-100 uppercase tracking-wider">
                  Blocked
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-100 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {isLoading ? (
                // Loading state
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : filteredEmployees.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={8} className="px-4 sm:px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        No employees found
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {hasActiveFilters
                          ? 'Try adjusting your filters or search query'
                          : 'No employees have been tracked yet'}
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
                getPaginatedEmployees().map((employee) => {
                  const status = getEmployeeStatus(employee);
                  return (
                    <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={employee.avatar}
                            firstName={
                              employee.candidate?.split(' ')[0] || 'Unknown'
                            }
                            lastName={
                              employee.candidate?.split(' ')[1] || 'User'
                            }
                            size="sm"
                            showStatus={false}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {employee.candidate || 'Unknown Candidate'}
                            </div>
                            {employee.email && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {employee.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {new Date(employee.date).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {employee.placement || (
                          <span className="text-gray-400 dark:text-gray-500">No placement</span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {formatGender(employee.gender)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {employee.phone || (
                          <span className="text-gray-400 dark:text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.style}`}
                        >
                          {status.text}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            employee.is_blocked
                              ? 'bg-red-50 text-red-700'
                              : 'bg-green-50 text-green-700'
                          }`}
                        >
                          {employee.is_blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative" ref={dropdownRef}>
                          <button
                            onClick={() => toggleOptions(employee.id)}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {showOptionsFor === employee.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-50">
                              <button
                                onClick={() => {
                                  setShowOptionsFor(null);
                                  navigate(
                                    `/admin/candidate-profile/${employee.id}`
                                  );
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                <User className="w-4 h-4 mr-3" />
                                View Profile
                              </button>
                              {employee.is_blocked ? (
                                <button
                                  onClick={() => handleUnblockUser(employee.id)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <Shield className="w-4 h-4 mr-3 text-green-600" />
                                  <span className="text-green-600">
                                    Unblock User
                                  </span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleBlockUser(employee.id)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <ShieldOff className="w-4 h-4 mr-3 text-red-600" />
                                  <span className="text-red-600">
                                    Block User
                                  </span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && filteredEmployees.length > 0 && totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Showing{' '}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredEmployees.length)}
              </span>{' '}
              of <span className="font-medium">{filteredEmployees.length}</span>{' '}
              results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-200"
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
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-green-600 text-white'
                            : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
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
                      <span key={page} className="px-2 text-gray-400 dark:text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-200"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default AdminTrack;
