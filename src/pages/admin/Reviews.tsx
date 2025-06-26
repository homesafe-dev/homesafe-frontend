import React, { useState, useEffect } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { format } from 'date-fns';
import reviewApi, { Review, ReviewFilters } from '../../api/reviewApi';



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



const Reviews: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'employers' | 'agents' | 'employees'
  >('employers');
  const [loading, setLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [averageRating, setAverageRating] = useState<string>('0');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<number | ''>('');
  const itemsPerPage = 15;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // Build filters based on active tab
        const filters: ReviewFilters = {
          limit: itemsPerPage,
          page: currentPage,
        };

        // Map tab to role filter
        if (activeTab === 'employers') {
          filters.role = 'employer';
        } else if (activeTab === 'agents') {
          filters.role = 'agent';
        } else if (activeTab === 'employees') {
          filters.role = 'employee';
        }

        // Add search filter if provided
        if (searchTerm.trim()) {
          filters.search = searchTerm.trim();
        }

        // Add rating filter if provided
        if (ratingFilter !== '') {
          filters.rating = ratingFilter as 1 | 2 | 3 | 4 | 5;
        }

        // Fetch reviews from API
        const response = await reviewApi.getAllReviews(filters);

        if (response.status && response.data) {
          setReviews(response.data.reviews.data);
          setTotalPages(response.data.reviews.last_page);

          // Set average rating from API response
          if (response.data.summary?.average_rating) {
            setAverageRating(parseFloat(response.data.summary.average_rating).toFixed(1));
          } else {
            // Calculate average rating from current reviews
            const avgRating = calculateAverageRating(response.data.reviews.data);
            setAverageRating(avgRating);
          }
        } else {
          setReviews([]);
          setTotalPages(1);
          setAverageRating('0');
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
        setTotalPages(1);
        setAverageRating('0');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [activeTab, currentPage, searchTerm, ratingFilter]);

  // Calculate average rating
  const calculateAverageRating = (reviews: Review[]): string => {
    if (reviews.length === 0) return '0';
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">All Reviews</h1>

        {/* Search and Filter Controls */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
            />
          </div>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value === '' ? '' : Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">All Ratings</option>
            <option value={5}>5 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={2}>2 Stars</option>
            <option value={1}>1 Star</option>
          </select>
        </div>
      </div>

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
            <span className="text-lg font-medium mr-2">{averageRating}</span>
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
          <>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                >
                  &lt;
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentPage === pageNum ? 'bg-gray-200' : 'hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                >
                  &gt;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reviews;
