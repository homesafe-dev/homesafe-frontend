import axiosInstance from './axiosConfig';

// User API endpoints
const USER_ENDPOINTS = {
  PROFILE: '/profile',
  KYC: '/user-kyc',
  REVIEWS: (userId: number) => `/users/${userId}/reviews`,
};

// User API service
const userApi = {
  /**
   * Get user profile
   * @returns Promise with the API response containing user profile details
   */
  getProfile: async () => {
    try {
      const response = await axiosInstance.get(USER_ENDPOINTS.PROFILE);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param profileData - User profile data to update (can be FormData for file uploads or regular object)
   * @returns Promise with the API response
   */
  updateProfile: async (profileData: any) => {
    try {
      // Set the appropriate content type for FormData
      const config = profileData instanceof FormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};

      const response = await axiosInstance.post(
        USER_ENDPOINTS.PROFILE,
        profileData,
        config
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  /**
   * Submit KYC information
   * @param kycData - KYC data to submit
   * @returns Promise with the API response
   */
  submitKYC: async (kycData: any) => {
    try {
      const response = await axiosInstance.post(USER_ENDPOINTS.KYC, kycData);
      return response.data;
    } catch (error) {
      console.error('Error submitting KYC information:', error);
      throw error;
    }
  },

  /**
   * Get KYC status
   * @returns Promise with the API response containing KYC status
   */
  getKYCStatus: async () => {
    try {
      const response = await axiosInstance.get(USER_ENDPOINTS.KYC);
      return response.data;
    } catch (error) {
      console.error('Error fetching KYC status:', error);
      throw error;
    }
  },

  /**
   * Get user reviews
   * @param userId - User ID to get reviews for
   * @returns Promise with the API response containing user reviews and average rating
   */
  getUserReviews: async (userId: number) => {
    try {
      const response = await axiosInstance.get(USER_ENDPOINTS.REVIEWS(userId));
      return response.data;
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  },
};

export default userApi;
