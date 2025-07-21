import React, { useState, useEffect, useCallback } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import EmployerReview from '../../components/Employee/EmployerReview';
import userApi from '../../api/userApi';
import { format } from 'date-fns';

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
  comment: string;
  rating: number;
  date: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewerName,
  reviewerAvatar,
  comment,
  rating,
  date,
}) => {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-3">
        {reviewerAvatar ? (
          <img
            src={reviewerAvatar}
            alt={reviewerName}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-3 object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3 flex-shrink-0">
            <span className="text-white font-medium text-xs sm:text-sm">
              {reviewerName
                .split(' ')
                .map((name) => name[0])
                .join('')}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[#24292E] text-[14px] sm:text-[16px] truncate">
            {reviewerName}
          </h3>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
      <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-3">
        {comment}
      </p>
      <div className="flex">
        {[...Array(5)].map((_, index) =>
          index < rating ? (
            <AiFillStar
              key={index}
              className="text-[#EFAE73] text-sm sm:text-base"
            />
          ) : (
            <AiOutlineStar
              key={index}
              className="text-[#EFAE73] text-sm sm:text-base"
            />
          )
        )}
      </div>
    </div>
  );
};

interface ReviewsPageProps {
  title?: string;
  userId?: number;
}

const ReviewsPage: React.FC<ReviewsPageProps> = ({
  title = 'Reviews',
  userId, // Optional prop, will fetch from profile if not provided
}) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Function to fetch user reviews
  const fetchUserReviews = useCallback(async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await userApi.getUserReviews(currentUserId);

      if (response.status) {
        setReviews(response.data.reviews || []);

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
  }, [currentUserId]);

  // Fetch user profile to get actual user ID
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // If userId is provided as prop, use it directly
        if (userId) {
          setCurrentUserId(userId);
          return;
        }

        // Otherwise, fetch from profile API
        const profileResponse = await userApi.getProfile();

        if (profileResponse.status && profileResponse.data) {
          setCurrentUserId(profileResponse.data.id);
        } else {
          setError('Failed to fetch user profile');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Error fetching user profile');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  // Fetch reviews when currentUserId changes
  useEffect(() => {
    fetchUserReviews();
  }, [fetchUserReviews]);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  // Handle review submission
  const handleReviewSubmitted = () => {
    // Refresh reviews after a new review is submitted
    fetchUserReviews();
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
          {!loading && !error && (
            <div className="flex items-center">
              <span className="text-base sm:text-lg font-medium mr-2">
                {!isNaN(parseFloat(averageRating))
                  ? parseFloat(averageRating).toFixed(1)
                  : '0.0'}
              </span>
              <div className="flex mr-2">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = !isNaN(parseFloat(averageRating))
                    ? parseFloat(averageRating)
                    : 0;
                  return (
                    <AiFillStar
                      key={index}
                      className={`text-sm sm:text-base ${
                        index < Math.round(ratingValue)
                          ? 'text-[#EFAE73]'
                          : 'text-gray-300'
                      }`}
                    />
                  );
                })}
              </div>
              <span className="text-xs sm:text-sm text-gray-500">
                ({reviews.length} reviews)
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsReviewModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#A5EA91] text-[#24292E] px-3 sm:px-4 py-2 rounded-[8px] hover:bg-[#95ddb1] transition-colors text-sm sm:text-base w-full sm:w-auto"
        >
          <AiOutlineStar className="text-[#24292E] flex-shrink-0" />
          <span className="truncate">Click to Review an Employer</span>
        </button>
      </div>

      <EmployerReview
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={handleReviewSubmitted}
      />

      <p className="mb-4 sm:mb-6 text-[#24292E] text-[14px] sm:text-[16px]">
        Here are the reviews from your employers
      </p>

      {loading && (
        <div className="flex justify-center items-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
          No reviews available
        </div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              reviewerName={`${review.reviewer.first_name} ${review.reviewer.last_name}`}
              reviewerAvatar={review.reviewer.avatar}
              comment={review.comment}
              rating={review.rating}
              date={formatDate(review.created_at)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
