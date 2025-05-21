import React, { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { format } from 'date-fns';

interface Reviewer {
  id: number;
  first_name: string;
  last_name: string;
  avatar?: string;
  occupation?: string;
  location?: string;
}

interface Review {
  id: number;
  reviewer_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: Reviewer;
}

interface ReviewCardProps {
  reviewerName: string;
  reviewerAvatar?: string;
  comment: string;
  rating: number;
  date: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewerName,
  reviewerAvatar,
  comment,
  rating,
  date,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-3">
        {reviewerAvatar ? (
          <img
            src={reviewerAvatar}
            alt={reviewerName}
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
            <span className="text-white font-medium">
              {reviewerName
                .split(' ')
                .map((name) => name[0])
                .join('')}
            </span>
          </div>
        )}
        <div>
          <h3 className="font-semibold text-[#24292E] text-[16px]">
            {reviewerName}
          </h3>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">{comment}</p>
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

// Generate mock reviews
const generateMockReviews = (count: number): Review[] => {
  const reviewers: Reviewer[] = [
    {
      id: 1,
      first_name: 'Cali',
      last_name: 'Foster Jenkins',
      occupation: 'Chef',
      location: 'Lagos State'
    },
    {
      id: 2,
      first_name: 'John',
      last_name: 'Doe',
      occupation: 'Software Engineer',
      location: 'Abuja'
    },
    {
      id: 3,
      first_name: 'Sarah',
      last_name: 'Smith',
      occupation: 'Accountant',
      location: 'Port Harcourt'
    },
    {
      id: 4,
      first_name: 'Michael',
      last_name: 'Johnson',
      occupation: 'Teacher',
      location: 'Kano'
    }
  ];

  const comments = [
    'Meet Cali foster, a passionate chef from Lagos State, Nigeria. With a love for cooking that knows no bounds, Cali brings the flavors of Lagos to every dish.',
    'Excellent service and very professional.',
    'Great experience working with them.',
    'Highly recommended for their expertise and dedication.'
  ];

  return Array(count).fill(null).map((_, index) => {
    const reviewerIndex = index % reviewers.length;
    const commentIndex = index % comments.length;
    
    return {
      id: index + 1,
      reviewer_id: reviewers[reviewerIndex].id,
      user_id: 100 + index,
      rating: Math.floor(Math.random() * 2) + 4, // Random rating between 4-5
      comment: comments[commentIndex],
      created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      reviewer: reviewers[reviewerIndex]
    };
  });
};

const mockEmployerReviews = generateMockReviews(9);
const mockAgentReviews = generateMockReviews(6);
const mockEmployeeReviews = generateMockReviews(12);

const Reviews: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'employers' | 'agents' | 'employees'>('employers');
  const [loading, setLoading] = useState<boolean>(false);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  // Get reviews based on active tab
  const getReviews = () => {
    switch (activeTab) {
      case 'employers':
        return mockEmployerReviews;
      case 'agents':
        return mockAgentReviews;
      case 'employees':
        return mockEmployeeReviews;
      default:
        return [];
    }
  };

  const reviews = getReviews();

  // Calculate average rating
  const calculateAverageRating = (reviews: Review[]): string => {
    if (reviews.length === 0) return '0';
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating(reviews);

  return (
    <div className="bg-white rounded-lg p-6">
      <h1 className="text-2xl font-semibold mb-6">All Reviews</h1>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="inline-flex border border-gray-200 rounded-md overflow-hidden">
          <button
            className={`px-6 py-2 ${
              activeTab === 'employers'
                ? 'bg-[#C8EDDF80] text-green-800'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('employers')}
          >
            Employers
          </button>
          <button
            className={`px-6 py-2 border-l border-r border-gray-200 ${
              activeTab === 'agents'
                ? 'bg-[#C8EDDF80] text-green-800'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('agents')}
          >
            Agents
          </button>
          <button
            className={`px-6 py-2 ${
              activeTab === 'employees'
                ? 'bg-[#C8EDDF80] text-green-800'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('employees')}
          >
            Employees
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Reviews
          </h2>
          <div className="flex items-center">
            <span className="text-lg font-medium mr-2">
              {averageRating}
            </span>
            <div className="flex">
              {[...Array(5)].map((_, index) => {
                const ratingValue = parseFloat(averageRating);
                return (
                  <AiFillStar
                    key={index}
                    className={
                      index < Math.round(ratingValue)
                        ? 'text-[#EFAE73]'
                        : 'text-gray-300'
                    }
                  />
                );
              })}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              ({reviews.length} reviews)
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No reviews available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                reviewerName={`${review.reviewer.first_name} ${review.reviewer.last_name}`}
                reviewerAvatar={review.reviewer.avatar}
                comment={review.comment}
                rating={review.rating}
                date={formatDate(review.created_at)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
