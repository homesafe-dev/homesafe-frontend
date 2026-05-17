import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  MapPin,
  Phone,
  User,
  Eye,
} from 'lucide-react';
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

const AllCandidatesPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [placementFilter, setPlacementFilter] = useState<string>('all');
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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await agentApi.getTrackedEmployees();
        if (response.status) {
          const employeesData = response.data || [];
          setEmployees(employeesData);
          setFilteredEmployees(employeesData);
          // If there's pagination info in the response, update totalPages
          if (response.meta && response.meta.last_page) {
            setTotalPages(response.meta.last_page);
          } else {
            setTotalPages(Math.ceil(employeesData.length / 10) || 1);
          }
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
  }, [currentPage]);

  // Filter employees based on search, status, and placement
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
    setTotalPages(Math.ceil(filtered.length / 10) || 1);
  }, [searchQuery, statusFilter, placementFilter, employees]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Candidates
              </h1>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
                View and manage all your tracked candidates
              </p>
            </div>
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            onClick={() => navigate('/agent/add-candidate')}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add New Candidate</span>
            <span className="sm:hidden">Add Candidate</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100">
        {/* Search and Filters Section */}
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or placement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white dark:bg-gray-800"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>

              <select
                value={placementFilter}
                onChange={(e) => setPlacementFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white dark:bg-gray-800"
              >
                <option value="all">All Placements</option>
                <option value="placed">Placed</option>
                <option value="unplaced">Not Placed</option>
              </select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-sm flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-100">
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
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
                  Phone Number
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100">
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
                      <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
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
                filteredEmployees.map((employee) => {
                  const isVerified =
                    employee.status &&
                    !employee.status.toLowerCase().includes('not') &&
                    employee.status.toLowerCase() !== 'unverified';
                  const placement = formatPlacement(employee.placement);
                  return (
                    <tr
                      key={employee.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={employee.avatar}
                            firstName={employee.candidate.split(' ')[0] || ''}
                            lastName={employee.candidate.split(' ')[1] || ''}
                            size="sm"
                            showStatus={false}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {employee.candidate}
                            </div>
                            {employee.email && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {employee.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(employee.date).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {placement === 'Not on placement' ||
                          placement === 'Not assigned' ? (
                            <span className="text-gray-400">{placement}</span>
                          ) : (
                            placement
                          )}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                          <User className="w-4 h-4 text-gray-400" />
                          {employee.gender
                            ? employee.gender.charAt(0).toUpperCase() +
                              employee.gender.slice(1)
                            : 'Not specified'}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {employee.phone || 'N/A'}
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
                          onClick={() =>
                            navigate(`/agent/candidate-profile/${employee.id}`)
                          }
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
        {!isLoading && filteredEmployees.length > 0 && totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing{' '}
              <span className="font-medium">{(currentPage - 1) * 10 + 1}</span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(currentPage * 10, filteredEmployees.length)}
              </span>{' '}
              of <span className="font-medium">{filteredEmployees.length}</span>{' '}
              results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                            : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
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
                className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

export default AllCandidatesPage;
