import React, { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import EmployerReview from '../../components/Employee/EmployerReview';

interface ReviewCardProps {
  chefName: string;
  description: string;
  rating: number;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ chefName, description, rating }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="font-semibold text-[#24292E] text-[16px] mb-3">{chefName}</h3>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          index < rating ? (
            <AiFillStar key={index} className="text-[#EFAE73]" />
          ) : (
            <AiOutlineStar key={index} className="text-[#EFAE73]" />
          )
        ))}
      </div>
    </div>
  );
};

interface ReviewsPageProps {
  title?: string;
}

const ReviewsPage: React.FC<ReviewsPageProps> = ({ title = "Reviews" }) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  
  // Sample data for the reviews
  const reviewsData = [
    {
      id: 1,
      chefName: "Cali Foster Jenkins",
      description: "Meet Cali Foster, a passionate chef from Lagos State, Nigeria. With a love for cooking that knows no bounds, Cali brings the flavors of Lagos to every dish.",
      rating: 4
    },
    {
      id: 2,
      chefName: "Cali Foster Jenkins",
      description: "Meet Cali Foster, a passionate chef from Lagos State, Nigeria. With a love for cooking that knows no bounds, Cali brings the flavors of Lagos to every dish.",
      rating: 4
    },
    {
      id: 3,
      chefName: "Cali Foster Jenkins",
      description: "Meet Cali Foster, a passionate chef from Lagos State, Nigeria. With a love for cooking that knows no bounds, Cali brings the flavors of Lagos to every dish.",
      rating: 4
    },
    {
      id: 4,
      chefName: "Cali Foster Jenkins",
      description: "Meet Cali Foster, a passionate chef from Lagos State, Nigeria. With a love for cooking that knows no bounds, Cali brings the flavors of Lagos to every dish.",
      rating: 4
    },
    {
      id: 5,
      chefName: "Cali Foster Jenkins",
      description: "Meet Cali Foster, a passionate chef from Lagos State, Nigeria. With a love for cooking that knows no bounds, Cali brings the flavors of Lagos to every dish.",
      rating: 4
    },
    {
      id: 6,
      chefName: "Cali Foster Jenkins",
      description: "Meet Cali Foster, a passionate chef from Lagos State, Nigeria. With a love for cooking that knows no bounds, Cali brings the flavors of Lagos to every dish.",
      rating: 4
    }
  ];

  return (
    <div className="bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button 
          onClick={() => setIsReviewModalOpen(true)}
          className="flex items-center gap-2 bg-[#A5EA91] text-[#24292E] px-4 py-2 rounded-[8px] hover:bg-[#95ddb1] transition-colors"
        >
          <AiOutlineStar className="text-[#24292E]" />
          Click to Review an Employer
        </button>
      </div>

      <EmployerReview 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />

      <p className='mb-6 text-[#24292E] text-[16px]'>Here are the reviews from your employers</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviewsData.map((review) => (
          <ReviewCard 
            key={review.id}
            chefName={review.chefName}
            description={review.description}
            rating={review.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewsPage;