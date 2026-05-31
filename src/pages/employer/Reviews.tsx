import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Calendar, User } from 'lucide-react';
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
    <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-lg border border-border-default shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start gap-4 mb-4">
        <Avatar
          src={reviewerAvatar}
          firstName={firstName}
          lastName={lastName}
          size="md"
          showStatus={false}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base truncate">
              {reviewerName}
            </h3>
          </div>
          {reviewerEmail && (
            <div className="flex items-center gap-1.5 mb-2">
              <User className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {reviewerEmail}
              </p>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-gray-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400">{date}</p>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${
                index < rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          ))}
          <span className="ml-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
            {rating}.0
          </span>
        </div>
        <div className="flex items-start gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed flex-1">
            {comment}
          </p>
        </div>
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

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

  useEffect(() => {
    const fetchUserReviews = async () => {
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
    };

    fetchUserReviews();
  }, [currentUserId]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  return (
    <div className="p-0">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
        </div>
        {!loading && !error && (
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-border-default rounded-lg px-4 py-2">
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
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
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{reviews.length}</span> review
              {reviews.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="bg-surface rounded-lg shadow-sm border border-border-default">
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        )}

        {error && (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          </div>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div className="text-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  No reviews available
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Reviews will appear here once they are submitted
                </p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && reviews.length > 0 && (
          <div className="p-4 sm:p-6">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
