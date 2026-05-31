import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Users } from 'lucide-react';
import artisanApi from '../../api/artisanApi';
import ArtisanCard from '../../components/Employer/ArtisanCard';
import Toast from '../../components/common/Toast';

interface Occupation {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    user_id: number;
    occupation_id: number;
  };
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  // Add other review properties as needed
}

interface Artisan {
  id: number;
  first_name: string;
  last_name: string;
  title: string | null;
  username: string | null;
  email: string;
  email_verified_at: string;
  avatar: string | null;
  gender: string | null;
  dob: string | null;
  phone: string;
  address: string | null;
  status: number;
  is_verified: number;
  salary: string;
  profile_description: string | null;
  created_at: string;
  updated_at: string;
  average_rating: number | string | null;
  total_reviews?: number | string | null;
  is_employed: boolean;
  occupations: Occupation[];
  reviews: Review[];
  active_contract: any;
}

const ArtisansPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [itemsPerPage] = useState<number>(15);

  // Filter states
  const [salaryFilter, setSalaryFilter] = useState<string>('');
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('');
  const [showSalaryDropdown, setShowSalaryDropdown] = useState<boolean>(false);
  const [showJobTypeDropdown, setShowJobTypeDropdown] =
    useState<boolean>(false);

  // Available job types (occupations)
  const [availableJobTypes, setAvailableJobTypes] = useState<string[]>([]);

  // Toast state
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setShowSalaryDropdown(false);
        setShowJobTypeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchArtisans = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await artisanApi.getEmployeeList(
          currentPage,
          itemsPerPage
        );

        if (response.status && response.data) {
          const artisanData = response.data?.data || response.data || [];

          setArtisans(artisanData);
          setTotalPages(response.data?.last_page || 1);

          // Extract unique job types from artisans
          const jobTypes = new Set<string>();
          artisanData.forEach((artisan: Artisan) => {
            if (artisan.occupations && artisan.occupations.length > 0) {
              artisan.occupations.forEach((occupation) => {
                jobTypes.add(
                  occupation.name.charAt(0).toUpperCase() +
                    occupation.name.slice(1)
                );
              });
            }
          });
          setAvailableJobTypes(Array.from(jobTypes).sort());
        } else {
          const errorMessage = response.message || 'Failed to load artisans';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        }
      } catch (err: any) {
        console.error('Error fetching artisans:', err);
        const errorMessage = err.message || 'Failed to load artisans';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, [currentPage, itemsPerPage]);

  // Function to extract location from address
  const extractLocation = (address: string | null): string | null => {
    if (!address) return null;

    // Try to extract city from address
    const parts = address.split(',');
    if (parts.length > 1) {
      return parts[1].trim();
    }

    // If no comma, return first few words
    const words = address.split(' ');
    return words.slice(0, 2).join(' ');
  };

  // Get salary filter label
  const getSalaryLabel = (filter: string): string => {
    switch (filter) {
      case 'under-50k':
        return 'Under ₦50,000';
      case '50k-100k':
        return '₦50,000 - ₦100,000';
      case '100k-200k':
        return '₦100,000 - ₦200,000';
      case 'over-200k':
        return 'Over ₦200,000';
      default:
        return 'Filter by Salary';
    }
  };

  // Filter artisans based on search query, salary, and job type
  const filteredArtisans = artisans.filter((artisan) => {
    const fullName = `${artisan.first_name} ${artisan.last_name}`.toLowerCase();
    const occupation =
      artisan.occupations && artisan.occupations.length > 0
        ? artisan.occupations[0].name.toLowerCase()
        : '';
    const location = extractLocation(artisan.address)?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();

    // Search filter
    const matchesSearch =
      !searchQuery ||
      fullName.includes(query) ||
      occupation.includes(query) ||
      location.includes(query);

    // Salary filter
    const salary = parseFloat(artisan.salary) || 0;
    let matchesSalary = true;
    if (salaryFilter) {
      switch (salaryFilter) {
        case 'under-50k':
          matchesSalary = salary < 50000;
          break;
        case '50k-100k':
          matchesSalary = salary >= 50000 && salary <= 100000;
          break;
        case '100k-200k':
          matchesSalary = salary > 100000 && salary <= 200000;
          break;
        case 'over-200k':
          matchesSalary = salary > 200000;
          break;
        default:
          matchesSalary = true;
      }
    }

    // Job type filter
    const matchesJobType =
      !jobTypeFilter ||
      (artisan.occupations &&
        artisan.occupations.some(
          (occ) =>
            occ.name.charAt(0).toUpperCase() + occ.name.slice(1) ===
            jobTypeFilter
        ));

    return matchesSearch && matchesSalary && matchesJobType;
  });

  return (
    <div className="p-0">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Artisans
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Browse and discover available artisans
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-surface rounded-lg shadow-sm border border-border-default">
        {/* Search and Filters Section */}
        <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-border-default">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, occupation or location..."
                className="w-full pl-10 pr-4 py-2.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Salary Filter */}
            <div className="relative dropdown-container">
              <button
                onClick={() => {
                  setShowSalaryDropdown(!showSalaryDropdown);
                  setShowJobTypeDropdown(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 border border-border-default rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-elevated/50 min-w-[160px] justify-between"
              >
                <span className="truncate">
                  {salaryFilter
                    ? getSalaryLabel(salaryFilter)
                    : 'Filter by Salary'}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform flex-shrink-0 ${showSalaryDropdown ? 'rotate-180' : ''}`}
                />
              </button>
              {showSalaryDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-border-default rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      setSalaryFilter('');
                      setShowSalaryDropdown(false);
                    }}
                    className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-elevated/50 first:rounded-t-lg"
                  >
                    All Salaries
                  </button>
                  <button
                    onClick={() => {
                      setSalaryFilter('under-50k');
                      setShowSalaryDropdown(false);
                    }}
                    className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-elevated/50"
                  >
                    Under ₦50,000
                  </button>
                  <button
                    onClick={() => {
                      setSalaryFilter('50k-100k');
                      setShowSalaryDropdown(false);
                    }}
                    className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-elevated/50"
                  >
                    ₦50,000 - ₦100,000
                  </button>
                  <button
                    onClick={() => {
                      setSalaryFilter('100k-200k');
                      setShowSalaryDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-elevated/50"
                  >
                    ₦100,000 - ₦200,000
                  </button>
                  <button
                    onClick={() => {
                      setSalaryFilter('over-200k');
                      setShowSalaryDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-elevated/50 last:rounded-b-lg"
                  >
                    Over ₦200,000
                  </button>
                </div>
              )}
            </div>

            {/* Job Type Filter */}
            <div className="relative dropdown-container">
              <button
                onClick={() => {
                  setShowJobTypeDropdown(!showJobTypeDropdown);
                  setShowSalaryDropdown(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 border border-border-default rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-elevated/50 min-w-[160px] justify-between"
              >
                <span className="truncate">
                  {jobTypeFilter || 'Filter by Job Type'}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform flex-shrink-0 ${showJobTypeDropdown ? 'rotate-180' : ''}`}
                />
              </button>
              {showJobTypeDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-border-default rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => {
                      setJobTypeFilter('');
                      setShowJobTypeDropdown(false);
                    }}
                    className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-elevated/50 first:rounded-t-lg"
                  >
                    All Job Types
                  </button>
                  {availableJobTypes.map((jobType) => (
                    <button
                      key={jobType}
                      onClick={() => {
                        setJobTypeFilter(jobType);
                        setShowJobTypeDropdown(false);
                      }}
                      className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-elevated/50 last:rounded-b-lg"
                    >
                      {jobType}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredArtisans.length} of {artisans.length} artisans
          </div>
        </div>

        {/* Artisans Grid */}
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : filteredArtisans.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No artisans found
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchQuery || salaryFilter || jobTypeFilter
                  ? 'Try adjusting your search or filters'
                  : 'No artisans available at the moment'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(260px,300px))]">
              {filteredArtisans.map((artisan) => (
                <ArtisanCard key={artisan.id} artisan={artisan} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border-default">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    currentPage === 1
                      ? 'border-gray-200 dark:border-gray-700 text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-elevated/50'
                  }`}
                >
                  Previous
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
                              : 'border border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-elevated/50'
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
                        <span
                          key={page}
                          className="px-2 text-gray-500 dark:text-gray-400"
                        >
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
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    currentPage === totalPages
                      ? 'border-gray-200 dark:border-gray-700 text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-elevated/50'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
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

export default ArtisansPage;
