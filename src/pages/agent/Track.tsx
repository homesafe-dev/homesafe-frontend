import { useState, useEffect, useRef } from 'react';
import {
  Search,
  MoreVertical,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import agentApi from '../../api/agentApi';
import Avatar from '../../components/common/Avatar';
import Toast from '../../components/common/Toast';

interface Employee {
  id: number;
  candidate: string;
  title: string;
  email: string;
  avatar: string;
  date: string;
  placement: string;
  gender: string;
  phone: string;
  status: string;
}

const CandidateTracker = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOptionsFor, setShowOptionsFor] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [placementFilter, setPlacementFilter] = useState<string>('all');
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
  const formatGender = (gender: string | null | undefined): string => {
    if (!gender || typeof gender !== 'string') return 'Not specified';
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  // Helper function to get employee status
  const getEmployeeStatus = (
    employee: Employee
  ): { text: string; style: string } => {
    if (
      employee.status &&
      (employee.status.toLowerCase().includes('not') ||
        employee.status.toLowerCase() === 'unverified')
    ) {
      return { text: 'Unverified', style: 'bg-red-50 text-red-700' };
    } else {
      return { text: 'Verified', style: 'bg-green-50 text-green-700' };
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await agentApi.getTrackedEmployees();
        if (response.status) {
          const employeeData = response.data || [];
          setEmployees(employeeData);
          setFilteredEmployees(employeeData);
          setTotalPages(Math.ceil(employeeData.length / itemsPerPage));
        } else {
          const errorMessage = response.message || 'Failed to fetch candidates';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        }
      } catch (err: any) {
        const errorMessage = 'Error fetching candidates';
        setError(errorMessage);
        showToast(errorMessage, 'error');
        console.error('Error fetching candidates:', err);
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
        const isVerified =
          emp.status &&
          !emp.status.toLowerCase().includes('not') &&
          emp.status.toLowerCase() !== 'unverified';
        if (statusFilter === 'verified') return isVerified;
        if (statusFilter === 'unverified') return !isVerified;
        return true;
      });
    }

    // Apply placement filter
    if (placementFilter !== 'all') {
      filtered = filtered.filter((emp) => {
        const hasPlacement =
          emp.placement &&
          emp.placement.toLowerCase() !== 'no employer assigned' &&
          emp.placement.toLowerCase() !== 'not assigned';
        if (placementFilter === 'placed') return hasPlacement;
        if (placementFilter === 'unplaced') return !hasPlacement;
        return true;
      });
    }

    setFilteredEmployees(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [searchQuery, statusFilter, placementFilter, employees]);

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

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPlacementFilter('all');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    placementFilter !== 'all';

  const formatPlacement = (placement: string | null | undefined): string => {
    if (!placement) return 'Not assigned';
    if (
      placement.toLowerCase() === 'no employer assigned' ||
      placement.toLowerCase() === 'not assigned'
    ) {
      return 'Not on placement';
    }
    return placement;
  };

  return (
    <div className="p-0">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Track Candidates
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Manage and monitor all tracked candidates
        </p>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-surface rounded-xl border border-border-default shadow-sm p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or placement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white dark:bg-gray-800"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>

            <select
              value={placementFilter}
              onChange={(e) => setPlacementFilter(e.target.value)}
              className="px-4 py-2.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white dark:bg-gray-800"
            >
              <option value="all">All Placements</option>
              <option value="placed">Placed</option>
              <option value="unplaced">Not Placed</option>
            </select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 border border-border-default rounded-lg hover:bg-elevated/50 transition-colors text-sm flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 pt-4 border-t border-border-default">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {filteredEmployees.length}
            </span>{' '}
            {filteredEmployees.length === 1 ? 'candidate' : 'candidates'}
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Table Section */}
      <div className="bg-surface rounded-xl border border-border-default shadow-sm overflow-hidden">
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
                  Gender
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border-default">
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
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="h-4 bg-gray-200 rounded w-4 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : filteredEmployees.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={7} className="px-4 sm:px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        No candidates found
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {hasActiveFilters
                          ? 'Try adjusting your filters or search query'
                          : 'No candidates have been tracked yet'}
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
                    <tr
                      key={employee.id}
                      className="hover:bg-elevated/50 transition-colors"
                    >
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
                        {formatPlacement(employee.placement) ===
                          'Not on placement' ||
                        formatPlacement(employee.placement) ===
                          'Not assigned' ? (
                          <span className="text-gray-400">
                            {formatPlacement(employee.placement)}
                          </span>
                        ) : (
                          formatPlacement(employee.placement)
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {formatGender(employee.gender)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {employee.phone || (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                            status.text === 'Verified'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {status.text}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative" ref={dropdownRef}>
                          <button
                            onClick={() => toggleOptions(employee.id)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {showOptionsFor === employee.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border-default py-1 z-50">
                              <button
                                onClick={() => {
                                  setShowOptionsFor(null);
                                  navigate(
                                    `/agent/candidate-profile/${employee.id}`
                                  );
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-elevated/50 transition-colors"
                              >
                                <User className="w-4 h-4 mr-3" />
                                View Profile
                              </button>
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
          <div className="px-4 sm:px-6 py-4 border-t border-border-default flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
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
                className="p-2 border border-border-default rounded-lg hover:bg-elevated/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                            : 'border border-border-default hover:bg-elevated/50'
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
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 border border-border-default rounded-lg hover:bg-elevated/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

export default CandidateTracker;
