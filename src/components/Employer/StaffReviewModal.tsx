import React, { useState } from 'react';
import { FaRegStar, FaStar, FaTimes } from 'react-icons/fa';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string) => void;
  staffName: string;
  isSubmitting?: boolean;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  staffName,
  isSubmitting = false,
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Reset form when modal closes
  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setFeedback('');
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) {
      return; // Don't submit if no rating is selected
    }
    onSubmit(rating, feedback);
    // Don't close the modal here - let the parent handle it after successful submission
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative z-10" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Review {staffName}</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex justify-center mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="text-3xl mx-1 focus:outline-none"
            >
              {star <= (hoveredRating || rating) ? (
                <FaStar className="text-yellow-400" />
              ) : (
                <FaRegStar className="text-gray-300" />
              )}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Feedback
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us more"
            className="w-full border border-gray-300 rounded-md py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={4}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          className="w-full py-3 bg-[#A5EA91] text-[#24292E] rounded-md font-medium hover:bg-green-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#24292E] mr-2"></div>
              Submitting...
            </div>
          ) : (
            'Submit Review'
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
