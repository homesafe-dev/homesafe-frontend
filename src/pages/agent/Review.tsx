import React, { useState, useEffect } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
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
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-3">
        {reviewerAvatar ? (
          <img
            src={reviewerAvatar}
            alt={reviewerName}
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
            <span className="text-white font-medium">
              {reviewerName
                .split(' ')
                .map((name) => name[0])
                .join('')}
            </span>
          </div>
        )}
        <div>
          <h3 className="font-semibold text-[#24292E] text-[16px]">
            {reviewerName}
          </h3>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">{comment}</p>
      <div className="flex">
        {[...Array(5)].map((_, index) =>
          index < rating ? (
            <AiFillStar key={index} className="text-[#EFAE73]" />
          ) : (
            <AiOutlineStar key={index} className="text-[#EFAE73]" />
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

const ReviewPage: React.FC<ReviewsPageProps> = ({
  title = 'Reviews',
  userId, // Will be fetched from user profile if not provided
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | undefined>(
    userId
  );

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
          console.log('Reviews API response:', response.data);
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
    <div className="bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        {!loading && !error && (
          <div className="flex items-center">
            <span className="text-lg font-medium mr-2">
              {!isNaN(parseFloat(averageRating))
                ? parseFloat(averageRating).toFixed(1)
                : '0.0'}
            </span>
            <div className="flex">
              {[...Array(5)].map((_, index) => {
                const ratingValue = !isNaN(parseFloat(averageRating))
                  ? parseFloat(averageRating)
                  : 0;
                return (
                  <AiFillStar
                    key={index}
                    className={
                      index < Math.round(ratingValue)
                        ? 'text-[#EFAE73]'
                        : 'text-gray-300'
                    }
                  />
                );
              })}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              ({reviews.length} reviews)
            </span>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No reviews available
        </div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

export default ReviewPage;
