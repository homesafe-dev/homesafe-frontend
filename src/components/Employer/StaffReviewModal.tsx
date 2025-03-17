// ReviewModal.tsx
import React, { useState } from 'react';
import { FaRegStar, FaStar, FaTimes } from 'react-icons/fa';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string) => void;
  staffName: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(rating, feedback);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Review Cali</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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
          className="w-full py-3 bg-[#A5EA91] text-[#24292E] rounded-md font-medium hover:bg-green-500 transition duration-200"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;