import React, { useState, useEffect } from 'react';
import {
  Star,
  MessageSquare,
  Search,
  Filter,
  X,
  Calendar,
  Mail,
} from 'lucide-react';
import userApi from '../../api/userApi';
import { format } from 'date-fns';
import Avatar from '../../components/common/Avatar';

interface Reviewer {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
  [key: string]: any;
}

interface Review {
  id: number;
  reviewer_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  reviewer: Reviewer;
}

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
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
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
            <div className="flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {reviewerEmail}
              </p>
            </div>
          )}
          <div className="flex items-center gap-1.5 mt-1">
            <Calendar className="w-3 h-3 text-gray-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400">{date}</p>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center gap-1 mb-2">
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
      <div className="flex items-start gap-2">
        <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed flex-1">
          {comment}
        </p>
      </div>
    </div>
  );
};

interface ReviewsPageProps {
  title?: string;
  userId?: number;
}

const ReviewPage: React.FC<ReviewsPageProps> = ({
  title = 'Reviews',
  userId, // Will be fetched from user profile if not provided
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | undefined>(
    userId
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<number | ''>('');

  // Fetch user profile to get the user ID if not provided
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userId) {
        setCurrentUserId(userId);
        return;
      }

      try {
        const response = await userApi.getProfile();
        if (response.status && response.data) {
          setCurrentUserId(response.data.id);
        } else {
          setError('Failed to fetch user profile');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Error fetching user profile');
      }
    };

    fetchUserProfile();
  }, [userId]);

  // Fetch user reviews once we have the user ID
  useEffect(() => {
    if (!currentUserId) return;

    const fetchUserReviews = async () => {
      try {
        setLoading(true);
        const response = await userApi.getUserReviews(currentUserId);

        if (response.status) {
          const reviewsData = response.data.reviews || [];
          setReviews(reviewsData);
          setFilteredReviews(reviewsData);

          // Ensure average_rating is a valid number or default to '0'
          const avgRating = response.data.average_rating;
          const validRating =
            avgRating && !isNaN(parseFloat(avgRating)) ? avgRating : '0';
          setAverageRating(validRating);
        } else {
          console.error('API returned error status:', response);
          setError('Failed to fetch reviews');
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Error fetching reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, [currentUserId]);

  // Filter reviews based on search and rating
  useEffect(() => {
    let filtered = [...reviews];

    // Apply search filter
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (review) =>
          review.comment?.toLowerCase().includes(query) ||
          `${review.reviewer.first_name} ${review.reviewer.last_name}`
            .toLowerCase()
            .includes(query) ||
          review.reviewer.email?.toLowerCase().includes(query)
      );
    }

    // Apply rating filter
    if (ratingFilter !== '') {
      filtered = filtered.filter((review) => review.rating === ratingFilter);
    }

    setFilteredReviews(filtered);
  }, [searchTerm, ratingFilter, reviews]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
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
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
              View and manage your reviews
            </p>
          </div>
        </div>

        {/* Average Rating Card */}
        {!loading && !error && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 shadow-sm inline-flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {!isNaN(parseFloat(averageRating))
                  ? parseFloat(averageRating).toFixed(1)
                  : '0.0'}
              </span>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = !isNaN(parseFloat(averageRating))
                    ? parseFloat(averageRating)
                    : 0;
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
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
            </span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100">
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
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
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
                  className="pl-10 pr-8 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm appearance-none bg-white dark:bg-gray-800"
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
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredReviews.length} review
              {filteredReviews.length !== 1 ? 's' : ''}
              {hasActiveFilters && ' (filtered)'}
            </div>
          </div>

          {/* Reviews Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <MessageSquare className="w-12 h-12 text-gray-300" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {hasActiveFilters
                      ? 'No reviews match your filters'
                      : 'No reviews available'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {hasActiveFilters
                      ? 'Try adjusting your search or filters'
                      : 'Reviews will appear here once they are submitted'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredReviews.map((review) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
