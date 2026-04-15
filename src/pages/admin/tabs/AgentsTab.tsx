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
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import Avatar from '../../../components/common/Avatar';
import Toast from '../../../components/common/Toast';
import CreateUserModal from '../../../components/CreateUserModal';

interface Agent {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string;
  status: string;
  total_employees: number;
  average_rating: number | null;
  total_reviews: number;
  gender?: string;
  address?: string;
  created_at?: string;
  is_verified?: number;
  is_blocked?: boolean;
}

export default function AgentsTab() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOptionsFor, setShowOptionsFor] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  // Filter agents based on search and filters
  useEffect(() => {
    let filtered = [...agents];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (agent) =>
          `${agent.first_name} ${agent.last_name}`
            .toLowerCase()
            .includes(query) ||
          agent.email.toLowerCase().includes(query) ||
          agent.phone?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((agent) => {
        if (statusFilter === 'verified') {
          return agent.is_verified === 1 || agent.status === 'verified';
        }
        if (statusFilter === 'unverified') {
          return agent.is_verified === 0 || agent.status === 'not verified';
        }
        return true;
      });
    }

    // Blocked filter
    if (blockedFilter !== 'all') {
      filtered = filtered.filter((agent) => {
        if (blockedFilter === 'blocked') return agent.is_blocked === true;
        if (blockedFilter === 'active') return agent.is_blocked === false;
        return true;
      });
    }

    setFilteredAgents(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [agents, searchQuery, statusFilter, blockedFilter]);

  // Get paginated agents
  const getPaginatedAgents = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAgents.slice(startIndex, endIndex);
  };

  const handleBlockUser = async (userId: number) => {
    try {
      const response = await adminApi.blockUser(userId);
      if (response.status) {
        showToast('User blocked successfully', 'success');
        setAgents(
          agents.map((agent) =>
            agent.id === userId ? { ...agent, is_blocked: true } : agent
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
        setAgents(
          agents.map((agent) =>
            agent.id === userId ? { ...agent, is_blocked: false } : agent
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
    const fetchAgents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use a larger limit to ensure we get all agents
        const response = await adminApi.getAgentList(1, 100);

        if (response.status) {
          const agentData = response.data?.data || response.data || [];
          setAgents(agentData);
        } else {
          const errorMessage = response.message || 'Failed to fetch agents';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        }
      } catch (err) {
        const errorMessage = 'Error fetching agents';
        setError(errorMessage);
        showToast(errorMessage, 'error');
        console.error('Error fetching agents:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div>
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            All Agents
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage and monitor all agents in the system
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Agent
        </button>
      </div>

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
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm appearance-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
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
              className="pl-4 pr-8 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm appearance-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
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
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredAgents.length} of {agents.length} agents
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Agent
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Total Employees
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Blocked
              </th>
              <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
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
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
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
                    <p className="text-sm text-gray-500">
                      Please try refreshing the page
                    </p>
                  </div>
                </td>
              </tr>
            ) : filteredAgents.length === 0 ? (
              // Empty state
              <tr>
                <td
                  colSpan={8}
                  className="px-4 sm:px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Users className="w-12 h-12 text-gray-300" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {hasActiveFilters
                          ? 'No agents match your filters'
                          : 'No agents found'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {hasActiveFilters
                          ? 'Try adjusting your search or filters'
                          : 'Agents will appear here once they register'}
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
              getPaginatedAgents().map((agent) => (
                <tr
                  key={agent.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={agent.avatar}
                        firstName={agent.first_name}
                        lastName={agent.last_name}
                        size="sm"
                        showStatus={false}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {`${agent.first_name} ${agent.last_name}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {agent.email || 'N/A'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {agent.address ? agent.address.split(',')[0] : 'Lagos'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {agent.total_employees !== undefined
                      ? agent.total_employees
                      : 'N/A'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {agent.phone || 'N/A'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        agent.is_verified === 0 ||
                        agent.status === 'not verified'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-green-50 text-green-700'
                      }`}
                    >
                      {agent.is_verified === 0 ||
                      agent.status === 'not verified'
                        ? 'Unverified'
                        : 'Verified'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        agent.is_blocked
                          ? 'bg-red-50 text-red-700'
                          : 'bg-green-50 text-green-700'
                      }`}
                    >
                      {agent.is_blocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() =>
                          setShowOptionsFor(
                            showOptionsFor === agent.id ? null : agent.id
                          )
                        }
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {showOptionsFor === agent.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                navigate(`/admin/user/${agent.id}`);
                                setShowOptionsFor(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <User className="w-4 h-4" />
                              View Profile
                            </button>
                            <button
                              onClick={() => {
                                if (agent.is_blocked) {
                                  handleUnblockUser(agent.id);
                                } else {
                                  handleBlockUser(agent.id);
                                }
                              }}
                              className={`w-full px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                                agent.is_blocked
                                  ? 'text-green-700'
                                  : 'text-red-700'
                              }`}
                            >
                              {agent.is_blocked ? (
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
      {!isLoading && !error && filteredAgents.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">
              {Math.min(
                (currentPage - 1) * itemsPerPage + 1,
                filteredAgents.length
              )}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredAgents.length)}
            </span>{' '}
            of <span className="font-medium">{filteredAgents.length}</span>{' '}
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

      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        userType="agent"
        onSuccess={() => {
          // Refresh the agents list
          window.location.reload();
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
}
