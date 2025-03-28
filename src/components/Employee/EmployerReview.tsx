import React, { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { FiX } from 'react-icons/fi';

interface EmployerReviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmployerReview: React.FC<EmployerReviewProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [employerName, setEmployerName] = useState('');
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the review submission here
    console.log({ employerName, rating, feedback });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="bg-white rounded-lg w-full max-w-md relative z-10 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium">Review Employer</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setRating(index + 1)}
                className="text-[30px] focus:outline-none"
              >
                {index < rating ? (
                  <AiFillStar className="text-[#EFAE73]" />
                ) : (
                  <AiOutlineStar className="text-[#EFAE73]" />
                )}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Employers' Name</label>
              <input
                type="text"
                placeholder="Enter name"
                value={employerName}
                onChange={(e) => setEmployerName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Additional Feedback</label>
              <textarea
                placeholder="Tell us more"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-1 focus:ring-gray-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#A5EA91] hover:bg-[#95ddb1] text-[#24292E] py-3 rounded-lg font-medium transition-colors"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployerReview;