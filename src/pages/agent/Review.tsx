import React from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

interface ReviewCardProps {
  chefName: string;
  description: string;
  rating: number;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  chefName,
  description,
  rating,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="font-semibold text-[#24292E] text-[16px] mb-3">
        {chefName}
      </h3>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
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
}

const ReviewPage: React.FC<ReviewsPageProps> = ({ title = 'Reviews' }) => {
  // Sample data for the reviews
  const reviewsData = [
    {
      id: 1,
      chefName: 'Cali Foster Jenkins',
      description:
        'Meet Cali Foster, a passionate chef from Lagos State, Nigeria. With a love for cooking that knows no bounds, Cali brings the flavors of Lagos to every dish.',
      rating: 4,
    },
    {
      id: 2,
      chefName: 'Cali Foster Jenkins',
      description:
        'Meet Cali Foster, a passionate chef from Lagos State, Nigeria. With a love for cooking that knows no bounds, Cali brings the flavors of Lagos to every dish.',
      rating: 4,
    },
    {
      id: 3,
      chefName: 'Cali Foster Jenkins',
      description:
        'Meet Cali Foster, a passionate chef from Lagos State, Nigeria. With a love for cooking that knows no bounds, Cali brings the flavors of Lagos to every dish.',
      rating: 4,
    },
    {
      id: 4,
      chefName: 'Cali Foster Jenkins',
      description:
        'Meet Cali Foster, a passionate chef from Lagos State, Nigeria. With a love for cooking that knows no bounds, Cali brings the flavors of Lagos to every dish.',
      rating: 4,
    },
    {
      id: 5,
      chefName: 'Cali Foster Jenkins',
      description:
        'Meet Cali Foster, a passionate chef from Lagos State, Nigeria. With a love for cooking that knows no bounds, Cali brings the flavors of Lagos to every dish.',
      rating: 4,
    },
    {
      id: 6,
      chefName: 'Cali Foster Jenkins',
      description:
        'Meet Cali Foster, a passionate chef from Lagos State, Nigeria. With a love for cooking that knows no bounds, Cali brings the flavors of Lagos to every dish.',
      rating: 4,
    },
  ];

  return (
    <div className="bg-gray-50 p-6">
      <h2 className="text-xl font-semibold mb-6">{title}</h2>
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

export default ReviewPage;
