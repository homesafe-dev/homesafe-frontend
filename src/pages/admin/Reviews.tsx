import React, { useState, useEffect } from 'react';
import {
  Star,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { format } from 'date-fns';
import reviewApi, { Review, ReviewFilters } from '../../api/reviewApi';
import Avatar from '../../components/common/Avatar';

interface ReviewCardProps {
  reviewerName: string;
  reviewerAvatar?: string;
  reviewerEmail?: string;
  comment: string;
  rating: number;
  date: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewerName,
  reviewerAvatar,
  reviewerEmail,
  comment,
  rating,
  date,
}) => {
  const firstName = reviewerName.split(' ')[0] || '';
  const lastName = reviewerName.split(' ').slice(1).join(' ') || '';

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <Avatar
          src={reviewerAvatar}
          firstName={firstName}
          lastName={lastName}
          size="md"
          showStatus={false}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
            {reviewerName}
          </h3>
          {reviewerEmail && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {reviewerEmail}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {date}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 break-words leading-relaxed">
        {comment}
      </p>
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating
                ? 'fill-[#EFAE73] text-[#EFAE73]'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {rating}.0
        </span>
      </div>
    </div>
  );
};

const Reviews: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'employers' | 'agents' | 'employees'
  >('employers');
  const [loading, setLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [averageRating, setAverageRating] = useState<string>('0');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<number | ''>('');
  const itemsPerPage = 15;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // Build filters based on active tab
        const filters: ReviewFilters = {
          limit: itemsPerPage,
          page: currentPage,
        };

        // Map tab to role filter
        if (activeTab === 'employers') {
          filters.role = 'employer';
        } else if (activeTab === 'agents') {
          filters.role = 'agent';
        } else if (activeTab === 'employees') {
          filters.role = 'employee';
        }

        // Add search filter if provided
        if (searchTerm.trim()) {
          filters.search = searchTerm.trim();
        }

        // Add rating filter if provided
        if (ratingFilter !== '') {
          filters.rating = ratingFilter as 1 | 2 | 3 | 4 | 5;
        }

        // Fetch reviews from API
        const response = await reviewApi.getAllReviews(filters);

        if (response.status && response.data) {
          setReviews(response.data.reviews.data);
          setTotalPages(response.data.reviews.last_page);

          // Set average rating from API response
          if (response.data.summary?.average_rating) {
            setAverageRating(
              parseFloat(response.data.summary.average_rating).toFixed(1)
            );
          } else {
            // Calculate average rating from current reviews
            const avgRating = calculateAverageRating(
              response.data.reviews.data
            );
            setAverageRating(avgRating);
          }
        } else {
          setReviews([]);
          setTotalPages(1);
          setAverageRating('0');
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
        setTotalPages(1);
        setAverageRating('0');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [activeTab, currentPage, searchTerm, ratingFilter, itemsPerPage]);

  // Calculate average rating
  const calculateAverageRating = (reviews: Review[]): string => {
    if (reviews.length === 0) return '0';
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRatingFilter('');
  };

  const hasActiveFilters = searchTerm.trim() !== '' || ratingFilter !== '';

  return (
    <div className="p-0">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Reviews
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          View and manage all reviews in the system
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        {/* Tabs */}
        <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex flex-wrap gap-2 sm:gap-0 sm:space-x-1">
            <button
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'employers'
                  ? 'bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/40'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
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
                  ? 'bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/40'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
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
                  ? 'bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/40'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
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
        <div className="p-4 sm:p-6">
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Rating Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={ratingFilter}
                  onChange={(e) =>
                    setRatingFilter(
                      e.target.value === '' ? '' : Number(e.target.value)
                    )
                  }
                  className="pl-10 pr-8 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm appearance-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                >
                  <option value="">All Ratings</option>
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
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

            {/* Results Count and Average Rating */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Showing {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </div>
              {reviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {averageRating}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, index) => {
                      const ratingValue = parseFloat(averageRating);
                      return (
                        <Star
                          key={index}
                          className={`w-4 h-4 ${
                            index < Math.round(ratingValue)
                              ? 'fill-[#EFAE73] text-[#EFAE73]'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    Average Rating
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {hasActiveFilters
                      ? 'No reviews match your filters'
                      : 'No reviews available'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {hasActiveFilters
                      ? 'Try adjusting your search or filters'
                      : `No ${activeTab} reviews have been submitted yet`}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    reviewerName={`${review.reviewer.first_name} ${review.reviewer.last_name}`}
                    reviewerAvatar={review.reviewer.avatar}
                    reviewerEmail={review.reviewer.email}
                    comment={review.comment}
                    rating={review.rating}
                    date={formatDate(review.created_at)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{' '}
                    <span className="font-medium">
                      {Math.min(
                        (currentPage - 1) * itemsPerPage + 1,
                        reviews.length
                      )}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, reviews.length)}
                    </span>{' '}
                    of <span className="font-medium">{reviews.length}</span>{' '}
                    results
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
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
                              onClick={() => handlePageChange(page)}
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
                      onClick={() => handlePageChange(currentPage + 1)}
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
    </div>
  );
};

export default Reviews;
