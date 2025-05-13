import React, { useState } from 'react';
import NoLoanImg from '../../assets/images/noitem.png';
import ReviewModal from './StaffReviewModal';

const Loan: React.FC = () => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleOpenReviewModal = () => {
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  const handleSubmitReview = (rating: number, feedback: string) => {
  
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 h-64">
      <div className="bg-gray-100 p-4 rounded-lg mb-4 mt-[5rem]">
        <img src={NoLoanImg} alt="" />
      </div>
      <h3 className="font-medium text-gray-700 mb-1">Nothing Here</h3>
      <p className="text-sm text-gray-500">
        <button
          className="font-semibold hover:text-gray-700 transition-colors"
          onClick={handleOpenReviewModal}
        >
          Click Here
        </button>{' '}
        to review this user
      </p>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        onSubmit={handleSubmitReview}
        staffName="Staff Member"
      />
    </div>
  );
};

export default Loan;
