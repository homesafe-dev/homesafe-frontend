import React, { useState, useEffect, useRef } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { FiX, FiSearch } from 'react-icons/fi';
import userApi from '../../api/userApi';
import Toast from '../common/Toast';

interface Employer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  company_name?: string;
}

interface EmployerReviewProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: () => void;
}

const EmployerReview: React.FC<EmployerReviewProps> = ({
  isOpen,
  onClose,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState(0);
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(
    null
  );
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (isOpen) {
      fetchEmployers();
    }
  }, [isOpen]);

  const fetchEmployers = async () => {
    try {
      setIsLoading(true);
      setError(null); // Clear any previous errors

      // Use a higher limit to get more employers for selection
      const response = await userApi.getEmployerList(1, 50);

      console.log('Employer API Response:', response); // Debug log

      if (response.status) {
        // Handle the new paginated response structure
        const employerData =
          response.data?.data?.data ||
          response.data?.data ||
          response.data ||
          [];
        console.log('Extracted employer data:', employerData); // Debug log
        setEmployers(employerData);
      } else {
        const errorMessage = response.message || 'Failed to fetch employers';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } catch (err) {
      console.error('Error fetching employers:', err);
      const errorMessage = 'An error occurred while fetching employers';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmployers = searchQuery
    ? employers.filter(
        (employer) =>
          `${employer.first_name} ${employer.last_name}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (employer.company_name &&
            employer.company_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          employer.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : employers;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!selectedEmployer) {
      setError('Please select an employer');
      return;
    }

    if (!feedback) {
      setError('Please provide feedback');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await userApi.submitReview({
        user_id: selectedEmployer.id,
        rating,
        comment: feedback,
      });

      if (response.status) {
        showToast('Review submitted successfully!', 'success');

        // Reset form
        setRating(0);
        setSelectedEmployer(null);
        setFeedback('');
        setSearchQuery('');

        // Notify parent component that a review was submitted
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }

        // Close modal after a delay to show the success toast
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        const errorMessage = response.message || 'Failed to submit review';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      const errorMessage = 'An error occurred while submitting your review';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmployerSelect = (employer: Employer) => {
    setSelectedEmployer(employer);
    setSearchQuery('');
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
              <label className="block text-sm mb-2">Search Employer</label>
              <div className="relative" ref={dropdownRef}>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employers"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {selectedEmployer && (
                  <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg relative">
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                      onClick={() => setSelectedEmployer(null)}
                    >
                      <FiX size={18} />
                    </button>
                    <div className="font-medium pr-6">
                      {selectedEmployer.first_name} {selectedEmployer.last_name}
                    </div>
                    {selectedEmployer.company_name && (
                      <div className="text-sm text-gray-500">
                        {selectedEmployer.company_name}
                      </div>
                    )}
                    <div className="text-xs text-gray-400">
                      {selectedEmployer.email}
                    </div>
                  </div>
                )}

                {searchQuery && !selectedEmployer && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {isLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        Loading employers...
                      </div>
                    ) : filteredEmployers.length > 0 ? (
                      filteredEmployers.map((employer) => (
                        <div
                          key={employer.id}
                          className="p-3 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleEmployerSelect(employer)}
                        >
                          <div className="font-medium">
                            {employer.first_name} {employer.last_name}
                          </div>
                          {employer.company_name && (
                            <div className="text-sm text-gray-500">
                              {employer.company_name}
                            </div>
                          )}
                          <div className="text-xs text-gray-400">
                            {employer.email}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No employers found matching your search
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Additional Feedback</label>
              <textarea
                placeholder="Tell us more about your experience with this employer"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-1 focus:ring-gray-400"
                required
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#A5EA91] hover:bg-[#95ddb1] text-[#24292E] py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>

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

export default EmployerReview;
