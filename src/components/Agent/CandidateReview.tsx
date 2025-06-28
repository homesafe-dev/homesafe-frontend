import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import NoReviewImg from '../../assets/images/noitem.png';

interface Review {
  id: number;
  rating: number;
  comment: string;
  date: string; // API uses 'date' instead of 'created_at'
  created_at?: string; // Keep for backward compatibility
  reviewer_name?: string; // Keep for backward compatibility
  reviewer?: {
    first_name: string;
    last_name: string;
    title?: string | null;
    email: string;
    avatar?: string;
  };
}

interface CandidateReviewProps {
  candidateId: number;
  candidateName: string;
  bio?: string;
  gender?: string;
  reviews?: Review[];
}

const CandidateReview: React.FC<CandidateReviewProps> = ({
  candidateName,
  bio,
  gender = 'female',
  reviews = [],
}) => {
  // Generate a default bio if none is provided
  const defaultBio = `Meet ${candidateName}, a ${gender} domestic staff. ${candidateName} is dedicated to providing quality service.`;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <AiFillStar
        key={index}
        className={index < rating ? 'text-[#EFAE73]' : 'text-gray-300'}
        size={20}
      />
    ));
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return totalRating / reviews.length;
  };

  const averageRating = calculateAverageRating();

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <img src={NoReviewImg} alt="No reviews" />
        </div>
        <h3 className="font-medium text-gray-700 mb-1">No Reviews Yet</h3>
        <p className="text-sm text-gray-500">
          No reviews have been submitted for {candidateName} yet.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Reviews ({reviews.length})
          </h3>
          <div className="flex items-center">
            <div className="flex mr-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="text-sm text-gray-600">
              ({averageRating.toFixed(1)}/5)
            </span>
          </div>
        </div>

        {reviews.map((review) => (
          <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <div className="flex">{renderStars(review.rating)}</div>
                <span className="text-sm text-gray-600">
                  ({review.rating}/5)
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.date || review.created_at || '').toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>

            {review.comment && (
              <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
            )}

            {(review.reviewer || review.reviewer_name) && (
              <div className="flex items-center mt-3 pt-2 border-t border-gray-100">
                {review.reviewer?.avatar && (
                  <img
                    src={review.reviewer.avatar}
                    alt="Reviewer"
                    className="w-6 h-6 rounded-full object-cover mr-2"
                  />
                )}
                <p className="text-xs text-gray-500">
                  Reviewed by {review.reviewer
                    ? `${review.reviewer.first_name} ${review.reviewer.last_name}`
                    : review.reviewer_name}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateReview;
