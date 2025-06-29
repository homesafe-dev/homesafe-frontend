import axiosInstance from './axiosConfig';

// Review API endpoints
const REVIEW_ENDPOINTS = {
  ADMIN_REVIEWS: '/admin/reviews',
};

// Review filter types
export interface ReviewFilters {
  limit?: number;
  role?: 'employer' | 'employee' | 'agent';
  rating?: 1 | 2 | 3 | 4 | 5;
  from_date?: string;
  to_date?: string;
  search?: string;
  sort_by?: 'rating' | 'created_at';
  sort_order?: 'asc' | 'desc';
  page?: number;
}

// Review interface based on API response
export interface Review {
  id: string;
  reviewer_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  reviewer: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
    role: 'employer' | 'employee' | 'agent';
    occupation?: string;
    location?: string;
  };
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'employer' | 'employee' | 'agent';
  };
}

export interface ReviewResponse {
  status: boolean;
  message: string;
  data: {
    reviews: {
      current_page: number;
      data: Review[];
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      links: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
      next_page_url: string | null;
      path: string;
      per_page: number;
      prev_page_url: string | null;
      to: number;
      total: number;
    };
    summary: {
      total_reviews: number;
      average_rating: string;
      rating_distribution: {
        [key: string]: number;
      };
    };
  };
}

// Review API service
const reviewApi = {
  /**
   * Get all reviews with filters (Admin)
   * @param filters - Filter options for reviews
   * @returns Promise with the API response
   */
  getAllReviews: async (
    filters: ReviewFilters = {}
  ): Promise<ReviewResponse> => {
    try {
      const params = new URLSearchParams();

      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axiosInstance.get(
        `${REVIEW_ENDPOINTS.ADMIN_REVIEWS}?${params.toString()}`
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  /**
   * Filter reviews by role
   * @param role - User role
   * @param rating - Rating filter (optional)
   * @param additionalFilters - Additional filter options
   * @returns Promise with the API response
   */
  filterByRole: async (
    role: ReviewFilters['role'],
    rating?: ReviewFilters['rating'],
    additionalFilters: Omit<ReviewFilters, 'role' | 'rating'> = {}
  ): Promise<ReviewResponse> => {
    return reviewApi.getAllReviews({
      role,
      rating,
      ...additionalFilters,
    });
  },

  /**
   * Search reviews
   * @param search - Search term
   * @param sort_by - Sort field (optional)
   * @param sort_order - Sort order (optional)
   * @param additionalFilters - Additional filter options
   * @returns Promise with the API response
   */
  searchReviews: async (
    search: string,
    sort_by?: ReviewFilters['sort_by'],
    sort_order?: ReviewFilters['sort_order'],
    additionalFilters: Omit<
      ReviewFilters,
      'search' | 'sort_by' | 'sort_order'
    > = {}
  ): Promise<ReviewResponse> => {
    return reviewApi.getAllReviews({
      search,
      sort_by,
      sort_order,
      ...additionalFilters,
    });
  },

  /**
   * Filter reviews by date range
   * @param from_date - Start date
   * @param to_date - End date
   * @param role - User role (optional)
   * @param additionalFilters - Additional filter options
   * @returns Promise with the API response
   */
  filterByDateRange: async (
    from_date: string,
    to_date: string,
    role?: ReviewFilters['role'],
    additionalFilters: Omit<
      ReviewFilters,
      'from_date' | 'to_date' | 'role'
    > = {}
  ): Promise<ReviewResponse> => {
    return reviewApi.getAllReviews({
      from_date,
      to_date,
      role,
      ...additionalFilters,
    });
  },

  /**
   * Filter reviews by rating
   * @param rating - Rating value
   * @param additionalFilters - Additional filter options
   * @returns Promise with the API response
   */
  filterByRating: async (
    rating: ReviewFilters['rating'],
    additionalFilters: Omit<ReviewFilters, 'rating'> = {}
  ): Promise<ReviewResponse> => {
    return reviewApi.getAllReviews({
      rating,
      ...additionalFilters,
    });
  },
};

export default reviewApi;
