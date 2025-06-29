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
      <div className="flex flex-col items-center justify-center p-4 h-64">
        <div className="bg-gray-100 p-4 rounded-lg mb-4 mt-[5rem]">
          <img src={NoLoanImg} alt="" />
        </div>
        <h3 className="font-medium text-gray-700 mb-1">No Reviews Yet</h3>
        <p className="text-sm text-gray-500">
          <button
            className="font-semibold hover:text-gray-700 transition-colors"
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
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Reviews for {employeeName}
        </h3>
        <button
          onClick={handleOpenReviewModal}
          className="bg-green-300 text-black px-4 py-2 rounded-md hover:bg-green-400 transition-colors"
        >
          Add Review
        </button>
      </div>

      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white border border-gray-200 rounded-lg p-4"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2">
              <div className="flex">{renderStars(review.rating)}</div>
              <span className="text-sm text-gray-600">({review.rating}/5)</span>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(review.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          {review.comment && (
            <p className="text-gray-700 text-sm">{review.comment}</p>
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
