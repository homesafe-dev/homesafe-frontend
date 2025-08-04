import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import artisanApi from '../../api/artisanApi';
import Avatar from '../../components/common/Avatar';
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
  average_rating: number | null;
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

        console.log('Artisans API Response:', response); // Debug log

        if (response.status && response.data) {
          // Handle the new paginated response structure
          const artisanData = response.data?.data || response.data || [];
          console.log('Extracted artisan data:', artisanData); // Debug log

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

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-yellow-400 text-lg ${i <= rating ? 'opacity-100' : 'opacity-30'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

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

  // Calculate age from date of birth
  const getAge = (dob: string | null): string | null => {
    if (!dob) return null;

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return `${age} yrs old`;
  };

  // Format location and age display
  const getLocationAgeDisplay = (
    address: string | null,
    dob: string | null
  ): string => {
    const location = extractLocation(address);
    const age = getAge(dob);

    if (location && age) {
      return `${location} | ${age}`;
    } else if (location) {
      return location;
    } else if (age) {
      return age;
    }

    return '';
  };

  // Get occupation name or default to "Professional"
  const getOccupation = (artisan: Artisan): string => {
    if (artisan.occupations && artisan.occupations.length > 0) {
      return (
        artisan.occupations[0].name.charAt(0).toUpperCase() +
        artisan.occupations[0].name.slice(1)
      );
    }
    return 'Professional';
  };

  // Get rating or default to 0
  const getRating = (artisan: Artisan): number => {
    return artisan.average_rating || 0;
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
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
          <h1 className="text-lg sm:text-xl font-semibold text-[#24292E]">
            Artisans
          </h1>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center">
            {/* Salary Filter */}
            <div className="relative dropdown-container w-full sm:w-auto">
              <button
                onClick={() => {
                  setShowSalaryDropdown(!showSalaryDropdown);
                  setShowJobTypeDropdown(false);
                }}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 hover:bg-gray-50 w-full sm:min-w-[140px] justify-between"
              >
                <span className="truncate">
                  {salaryFilter
                    ? getSalaryLabel(salaryFilter)
                    : 'Filter by Salary'}
                </span>
                <FiChevronDown
                  className={`transition-transform flex-shrink-0 ${showSalaryDropdown ? 'rotate-180' : ''}`}
                  size={14}
                />
              </button>
              {showSalaryDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      setSalaryFilter('');
                      setShowSalaryDropdown(false);
                    }}
                    className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-50 first:rounded-t-lg"
                  >
                    All Salaries
                  </button>
                  <button
                    onClick={() => {
                      setSalaryFilter('under-50k');
                      setShowSalaryDropdown(false);
                    }}
                    className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-50"
                  >
                    Under ₦50,000
                  </button>
                  <button
                    onClick={() => {
                      setSalaryFilter('50k-100k');
                      setShowSalaryDropdown(false);
                    }}
                    className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-50"
                  >
                    ₦50,000 - ₦100,000
                  </button>
                  <button
                    onClick={() => {
                      setSalaryFilter('100k-200k');
                      setShowSalaryDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    ₦100,000 - ₦200,000
                  </button>
                  <button
                    onClick={() => {
                      setSalaryFilter('over-200k');
                      setShowSalaryDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 last:rounded-b-lg"
                  >
                    Over ₦200,000
                  </button>
                </div>
              )}
            </div>

            {/* Job Type Filter */}
            <div className="relative dropdown-container w-full sm:w-auto">
              <button
                onClick={() => {
                  setShowJobTypeDropdown(!showJobTypeDropdown);
                  setShowSalaryDropdown(false);
                }}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 hover:bg-gray-50 w-full sm:min-w-[140px] justify-between"
              >
                <span className="truncate">
                  {jobTypeFilter || 'Filter by Job Type'}
                </span>
                <FiChevronDown
                  className={`transition-transform flex-shrink-0 ${showJobTypeDropdown ? 'rotate-180' : ''}`}
                  size={14}
                />
              </button>
              {showJobTypeDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => {
                      setJobTypeFilter('');
                      setShowJobTypeDropdown(false);
                    }}
                    className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-50 first:rounded-t-lg"
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
                      className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-50 last:rounded-b-lg"
                    >
                      {jobType}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-[280px] lg:w-[335px] h-[38px] sm:h-[42px]">
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search by name, occupation or location"
                className="w-full pl-9 sm:pl-10 pr-4 py-2 border border-gray-100 rounded-[16px] text-sm sm:text-[16px] text-[#5A6672] focus:outline-none focus:ring-1 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-[13px] text-[#24292E] mb-4 sm:mb-6">
          List of available artisans
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : filteredArtisans.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No artisans found matching your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-4 sm:gap-y-6">
            {filteredArtisans.map((artisan) => (
              <div
                key={artisan.id}
                className={`flex flex-col items-center bg-white p-4 sm:p-6 lg:p-8 shadow relative ${
                  artisan.is_employed ? 'opacity-60 grayscale' : ''
                }`}
              >
                {/* Hired Badge - moved to left side */}
                {artisan.is_employed && (
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    HIRED
                  </div>
                )}

                {/* Verified Star - in right section where hired used to be */}
                {artisan.status === 1 && (
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-green-500 text-base sm:text-lg">
                    ★
                  </div>
                )}

                <div className="mb-2 sm:mb-3">
                  <Avatar
                    src={artisan.avatar}
                    firstName={artisan.first_name}
                    lastName={artisan.last_name}
                    size="lg"
                    showStatus={false}
                    isOnline={artisan.status === 1}
                  />
                </div>
                <h3 className="font-medium text-center text-sm sm:text-[16px] text-[#24292E] mt-2 sm:mt-[1rem]">
                  {artisan.first_name} {artisan.last_name}
                </h3>
                {getLocationAgeDisplay(artisan.address, artisan.dob) && (
                  <p className="text-xs sm:text-sm text-gray-500 mb-1 mt-2 sm:mt-[0.5rem]">
                    {getLocationAgeDisplay(artisan.address, artisan.dob)}
                  </p>
                )}
                <div className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs mb-2 mt-2 sm:mt-[0.5rem]">
                  {getOccupation(artisan)}
                </div>
                <div className="flex mb-2 sm:mb-3">
                  {renderStars(getRating(artisan))}
                </div>
                <Link
                  to={`/employer/artisan/profile?id=${artisan.id}`}
                  className="w-full"
                >
                  <button
                    className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm transition-colors w-full text-center mt-2 sm:mt-[1rem] cursor-pointer ${
                      artisan.is_employed
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-[#A5EA91] hover:bg-green-300 text-[#24292E]'
                    }`}
                    disabled={artisan.is_employed}
                  >
                    View Profile
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentPage === page ? 'bg-gray-200' : 'hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Next
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

export default ArtisansPage;
