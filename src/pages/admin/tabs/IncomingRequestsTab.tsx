import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Search,
  MoreVertical,
  User,
  CheckCircle,
  XCircle,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import Avatar from '../../../components/common/Avatar';
import ApproveUserModal from '../../../components/admin/ApproveUserModal';
import DeclineUserModal from '../../../components/admin/DeclineUserModal';
import Toast from '../../../components/common/Toast';

interface User {
  id: number;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  username: string | null;
  email: string;
  email_verified_at: string | null;
  avatar: string | null;
  gender: string | null;
  dob: string | null;
  phone: string | null;
  address: string | null;
  status: number;
  is_verified: number;
  salary: string;
  profile_description: string | null;
  created_at: string;
  updated_at: string;
}

export default function IncomingRequestsTab() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOptionsFor, setShowOptionsFor] = useState<number | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all');
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

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = [...users];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          `${user.first_name || ''} ${user.last_name || ''}`
            .toLowerCase()
            .includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.phone?.toLowerCase().includes(query)
      );
    }

    // Gender filter
    if (genderFilter !== 'all') {
      filtered = filtered.filter((user) => {
        if (!user.gender) return false;
        return user.gender.toLowerCase() === genderFilter.toLowerCase();
      });
    }

    setFilteredUsers(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, searchQuery, genderFilter]);

  // Get paginated users
  const getPaginatedUsers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setGenderFilter('all');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || genderFilter !== 'all';

  const fetchUnapprovedUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminApi.getUnapprovedUsers(1, 100);
      if (response.status) {
        const userData = response.data.data || [];
        setUsers(userData);
      } else {
        const errorMessage =
          response.message || 'Failed to fetch incoming requests';
        setError(errorMessage);
        setToast({ message: errorMessage, type: 'error', isVisible: true });
      }
    } catch (err) {
      const errorMessage = 'Error fetching incoming requests';
      setError(errorMessage);
      setToast({ message: errorMessage, type: 'error', isVisible: true });
      console.error('Error fetching incoming requests:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnapprovedUsers();
  }, [fetchUnapprovedUsers]);

  const handleApproveUser = async () => {
    if (!selectedUserId) return;

    try {
      const response = await adminApi.approveUser(selectedUserId.toString());
      if (response.status) {
        showToast('User approved successfully', 'success');
        // Refresh the list after approval
        fetchUnapprovedUsers();
        setShowApproveModal(false);
        setSelectedUserId(null);
      } else {
        const errorMessage = response.message || 'Failed to approve user';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } catch (err) {
      const errorMessage = 'Error approving user';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('Error approving user:', err);
    }
  };

  const handleDeclineUser = async () => {
    if (!selectedUserId) return;

    try {
      const response = await adminApi.declineUser(selectedUserId.toString());
      if (response.status) {
        showToast('User declined successfully', 'success');
        // Refresh the list after declining
        fetchUnapprovedUsers();
        setShowDeclineModal(false);
        setSelectedUserId(null);
      } else {
        const errorMessage = response.message || 'Failed to decline user';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } catch (err) {
      const errorMessage = 'Error declining user';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('Error declining user:', err);
    }
  };

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

          {/* Gender Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm appearance-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
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

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} pending requests
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-border-default dark:border-gray-700">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date Requested
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
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
                    <div className="h-8 bg-gray-200 rounded w-8 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : error ? (
              // Error state
              <tr>
                <td
                  colSpan={7}
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
            ) : filteredUsers.length === 0 ? (
              // Empty state
              <tr>
                <td
                  colSpan={7}
                  className="px-4 sm:px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Users className="w-12 h-12 text-gray-300" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {hasActiveFilters
                          ? 'No requests match your filters'
                          : 'No incoming requests'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {hasActiveFilters
                          ? 'Try adjusting your search or filters'
                          : 'All requests have been processed'}
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
              getPaginatedUsers().map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user.avatar}
                        firstName={user.first_name || ''}
                        lastName={user.last_name || ''}
                        size="sm"
                        showStatus={false}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.first_name && user.last_name
                            ? `${user.first_name} ${user.last_name}`
                            : user.email}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.address ? user.address.split(',')[0] : 'Lagos'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.gender
                      ? user.gender.charAt(0).toUpperCase() +
                        user.gender.slice(1)
                      : 'Not specified'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.phone || 'Not provided'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                      Unverified
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() =>
                          setShowOptionsFor(
                            showOptionsFor === user.id ? null : user.id
                          )
                        }
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {showOptionsFor === user.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border-default z-10">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                navigate(`/admin/user/${user.id}`);
                                setShowOptionsFor(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <User className="w-4 h-4" />
                              View Profile
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setShowApproveModal(true);
                                setShowOptionsFor(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-green-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setShowDeclineModal(true);
                                setShowOptionsFor(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Decline
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
      {!isLoading && !error && filteredUsers.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">
              {Math.min(
                (currentPage - 1) * itemsPerPage + 1,
                filteredUsers.length
              )}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
            </span>{' '}
            of <span className="font-medium">{filteredUsers.length}</span>{' '}
            results
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border transition-colors ${
                currentPage === 1
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
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
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-2 text-gray-500">
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
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Approve User Modal */}
      {showApproveModal && (
        <ApproveUserModal
          onClose={() => {
            setShowApproveModal(false);
            setSelectedUserId(null);
          }}
          onApprove={handleApproveUser}
        />
      )}

      {/* Decline User Modal */}
      {showDeclineModal && (
        <DeclineUserModal
          onClose={() => {
            setShowDeclineModal(false);
            setSelectedUserId(null);
          }}
          onDecline={handleDeclineUser}
        />
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
