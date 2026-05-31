import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChevronLeft,
  MoreVertical,
  User,
  Trash2,
  Plus,
  Search,
  Filter,
  X,
  ChevronRight,
  Users,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateUserModal from '../../components/CreateUserModal';
import adminApi from '../../api/adminApi';
import adminSettingsApi from '../../api/adminSettingsApi';
import { format } from 'date-fns';
import Avatar from '../../components/common/Avatar';
import Toast from '../../components/common/Toast';

interface Admin {
  id: number;
  first_name: string;
  last_name: string;
  title?: string;
  username?: string;
  email: string;
  email_verified_at?: string;
  avatar?: string;
  gender: string;
  dob?: string;
  phone: string;
  address?: string;
  status: number;
  otp_code?: string;
  otp_expires_at?: string;
  otp_purpose?: string;
  is_verified: number;
  salary?: string;
  profile_description?: string;
  created_by?: number;
  approval_status: string;
  is_blocked: boolean;
  fcm_token?: string;
  password_changed_at?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

const AdminSettings: React.FC = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showOptionsFor, setShowOptionsFor] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
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

  // Filter admins based on search and filters
  useEffect(() => {
    let filtered = [...admins];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (admin) =>
          `${admin.first_name} ${admin.last_name}`
            .toLowerCase()
            .includes(query) ||
          admin.email.toLowerCase().includes(query) ||
          admin.phone?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((admin) => {
        if (statusFilter === 'verified') return admin.is_verified === 1;
        if (statusFilter === 'unverified') return admin.is_verified === 0;
        return true;
      });
    }

    // Gender filter
    if (genderFilter !== 'all') {
      filtered = filtered.filter((admin) => {
        if (!admin.gender) return false;
        return admin.gender.toLowerCase() === genderFilter.toLowerCase();
      });
    }

    setFilteredAdmins(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [admins, searchQuery, statusFilter, genderFilter]);

  // Get paginated admins
  const getPaginatedAdmins = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAdmins.slice(startIndex, endIndex);
  };

  const fetchAdmins = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Call the real API - fetch more to allow client-side filtering
      const response = await adminApi.getAdminList(1, 100);

      if (response.status && response.data) {
        // Handle nested data structure
        const adminsData = response.data.data || response.data;
        const adminsArray = Array.isArray(adminsData) ? adminsData : [];
        setAdmins(adminsArray);
        setFilteredAdmins(adminsArray);
      } else {
        setAdmins([]);
        setFilteredAdmins([]);
        setTotalPages(1);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to fetch admins';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      setAdmins([]);
      setFilteredAdmins([]);
      setTotalPages(1);
      console.error('Error fetching admins:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleRemoveAdmin = async (adminId: number) => {
    try {
      // Call the real API to delete the admin
      await adminSettingsApi.deleteAdmin(adminId);

      // Update the UI by removing the admin from the list
      setAdmins(admins.filter((admin) => admin.id !== adminId));
      setShowOptionsFor(null);
      showToast('Admin removed successfully', 'success');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to remove admin';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('Error removing admin:', err);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setGenderFilter('all');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    genderFilter !== 'all';

  return (
    <div className="p-0">
      {/* Back Button */}
      <div className="mb-4 sm:mb-6">
        <button
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Back</span>
        </button>
      </div>

      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Admin Settings
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Manage all admin users in the system
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium hidden sm:block"
              onClick={() => navigate('/admin/all-admins')}
            >
              View All →
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-[#A5EA91] hover:bg-[#95ddb1] text-[#174B35] rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create New Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-surface rounded-lg shadow-sm border border-border-default dark:border-gray-700">
        {/* Search and Filters Section */}
        <div className="p-4 sm:p-6 border-b border-border-default dark:border-gray-700">
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

              {/* Gender Filter */}
              <div className="relative">
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="pl-4 pr-8 py-2.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm appearance-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
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
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Showing {filteredAdmins.length} of {admins.length} admins
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="p-4 sm:p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-2">
                <p className="font-medium text-red-600">{error}</p>
                <p className="text-sm text-gray-500">
                  Please try refreshing the page
                </p>
              </div>
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Users className="w-12 h-12 text-gray-300" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {hasActiveFilters
                      ? 'No admins match your filters'
                      : 'No admins found'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {hasActiveFilters
                      ? 'Try adjusting your search or filters'
                      : 'No admin users have been created yet'}
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
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-700 border-b border-border-default dark:border-slate-500">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-100 uppercase tracking-wider">
                        Admin
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-100 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-100 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-100 uppercase tracking-wider">
                        Date of Birth
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-100 uppercase tracking-wider">
                        Gender
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-100 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-100 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-border-default dark:divide-gray-700">
                    {getPaginatedAdmins().map((admin) => (
                      <tr
                        key={admin.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={admin.avatar}
                              firstName={admin.first_name}
                              lastName={admin.last_name}
                              size="sm"
                              showStatus={false}
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {`${admin.first_name} ${admin.last_name}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {admin.email}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {admin.phone || 'N/A'}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {admin.dob
                            ? (() => {
                                try {
                                  return format(
                                    new Date(admin.dob),
                                    'MMM dd, yyyy'
                                  );
                                } catch {
                                  return admin.dob;
                                }
                              })()
                            : 'N/A'}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 capitalize">
                          {admin.gender || 'N/A'}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              admin.is_verified
                                ? 'bg-green-50 text-green-700'
                                : 'bg-yellow-50 text-yellow-700'
                            }`}
                          >
                            {admin.is_verified ? 'Verified' : 'Unverified'}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="relative" ref={dropdownRef}>
                            <button
                              onClick={() =>
                                setShowOptionsFor(
                                  showOptionsFor === admin.id ? null : admin.id
                                )
                              }
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>

                            {showOptionsFor === admin.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border-default z-10">
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      navigate(`/admin/user/${admin.id}`);
                                      setShowOptionsFor(null);
                                    }}
                                    className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                  >
                                    <User className="w-4 h-4" />
                                    View Profile
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleRemoveAdmin(admin.id);
                                    }}
                                    className="w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Remove Admin
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredAdmins.length > 0 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{' '}
                    <span className="font-medium">
                      {Math.min(
                        (currentPage - 1) * itemsPerPage + 1,
                        filteredAdmins.length
                      )}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredAdmins.length
                      )}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{filteredAdmins.length}</span>{' '}
                    results
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg border transition-colors ${
                        currentPage === 1
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
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
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span key={page} className="px-2 text-gray-500">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }
                    )}

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
            </>
          )}
        </div>
      </div>

      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        userType="admin"
        onSuccess={() => {
          // Refresh the admins list
          fetchAdmins();
        }}
      />

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

export default AdminSettings;
