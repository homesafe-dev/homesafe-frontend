import React, { useState } from 'react';
import NoLoanImg from '../../assets/images/noitem.png';
import ReviewModal from './StaffReviewModal';
import userApi from '../../api/userApi';
import Toast from '../common/Toast';

interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  reviewer_name?: string; // Keep for backward compatibility
  reviewer?: {
    id: number;
    first_name: string;
    last_name: string;
    avatar?: string;
  };
}

interface StaffReviewProps {
  reviews?: Review[];
  employeeName?: string;
  employeeId?: number;
  onReviewSubmitted?: () => void; // Callback to refresh reviews after submission
}

const StaffReview: React.FC<StaffReviewProps> = ({
  reviews = [],
  employeeName = 'Staff Member',
  employeeId,
  onReviewSubmitted,
}) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleOpenReviewModal = () => {
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!employeeId) {
      showToast('Employee ID is required to submit a review', 'error');
      return;
    }

    if (rating === 0) {
      showToast('Please select a rating before submitting', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await userApi.createReview(employeeId, {
        rating,
        comment,
      });

      if (response.status) {
        showToast('Review submitted successfully!', 'success');
        setIsReviewModalOpen(false);

        // Call the callback to refresh the reviews list
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      } else {
        showToast(response.message || 'Failed to submit review', 'error');
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Failed to submit review. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-3 sm:p-4 h-48 sm:h-64">
        <div className="bg-gray-100 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 mt-8 sm:mt-[5rem]">
          <img
            src={NoLoanImg}
            alt=""
            className="w-16 h-16 sm:w-auto sm:h-auto"
          />
        </div>
        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1 text-sm sm:text-base">
          No Reviews Yet
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
          <button
            className="font-semibold hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            onClick={handleOpenReviewModal}
          >
            Click Here
          </button>{' '}
          to review {employeeName}
        </p>

        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={handleCloseReviewModal}
          onSubmit={handleSubmitReview}
          staffName={employeeName}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 p-2 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 gap-3">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
          Reviews for {employeeName}
        </h3>
        <button
          onClick={handleOpenReviewModal}
          className="bg-green-300 text-gray-900 dark:text-gray-100 px-3 sm:px-4 py-2 rounded-md hover:bg-green-400 transition-colors text-sm sm:text-base w-full sm:w-auto"
        >
          Add Review
        </button>
      </div>

      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
            <div className="flex items-center space-x-2">
              <div className="flex">{renderStars(review.rating)}</div>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                ({review.rating}/5)
              </span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {new Date(review.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          {review.comment && (
            <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
              {review.comment}
            </p>
          )}

          {(review.reviewer || review.reviewer_name) && (
            <div className="flex items-center mt-2 sm:mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              {review.reviewer?.avatar && (
                <img
                  src={review.reviewer.avatar}
                  alt="Reviewer"
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover mr-2"
                />
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Reviewed by{' '}
                {review.reviewer
                  ? `${review.reviewer.first_name} ${review.reviewer.last_name}`
                  : review.reviewer_name}
              </p>
            </div>
          )}
        </div>
      ))}

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        onSubmit={handleSubmitReview}
        staffName={employeeName}
        isSubmitting={isSubmitting}
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

export default StaffReview;
