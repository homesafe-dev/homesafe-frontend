import axiosInstance from './axiosConfig';

// User API endpoints
const USER_ENDPOINTS = {
  PROFILE: '/profile',
  KYC: '/user-kyc',
  REVIEWS: (userId: number) => `/users/${userId}/reviews`,
  MEDICAL: '/user-medicals',
  EMPLOYER_LIST: '/users',
  CHANGE_PASSWORD: '/change-password',
  SALARY: (userId: number) => `/profile/${userId}/salary`,
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
      const config =
        profileData instanceof FormData
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
   * @param kycData - KYC data to submit with number and type fields
   * @returns Promise with the API response
   */
  submitKYC: async (kycData: { number: string | number; type: string }) => {
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

  /**
   * Upload medical record
   * @param medicalFile - Medical file to upload
   * @returns Promise with the API response
   */
  uploadMedicalRecord: async (medicalFile: File) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('medical_file', medicalFile);

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };

      const response = await axiosInstance.post(
        USER_ENDPOINTS.MEDICAL,
        formData,
        config
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading medical record:', error);
      throw error;
    }
  },

  /**
   * Get user medical records
   * @returns Promise with the API response containing user medical records
   */
  getMedicalRecords: async () => {
    try {
      const response = await axiosInstance.get(USER_ENDPOINTS.MEDICAL);
      return response.data;
    } catch (error) {
      console.error('Error fetching medical records:', error);
      throw error;
    }
  },

  /**
   * Submit a review for a user
   * @param reviewData - Review data including user_id, rating, and comment
   * @returns Promise with the API response
   */
  submitReview: async (reviewData: {
    user_id: number;
    rating: number;
    comment: string;
  }) => {
    try {
      const response = await axiosInstance.post(
        USER_ENDPOINTS.REVIEWS(reviewData.user_id),
        {
          rating: reviewData.rating,
          comment: reviewData.comment,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  },

  /**
   * Get employer list
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @returns Promise with the API response containing employer list
   */
  getEmployerList: async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get(USER_ENDPOINTS.EMPLOYER_LIST, {
        params: {
          role: 'employer',
          page,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching employer list:', error);
      throw error;
    }
  },

  /**
   * Change user password
   * @param passwordData - Object containing old_password and new_password
   * @returns Promise with the API response
   */
  changePassword: async (passwordData: {
    old_password: string;
    new_password: string;
  }) => {
    try {
      const response = await axiosInstance.post(
        USER_ENDPOINTS.CHANGE_PASSWORD,
        passwordData
      );
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  /**
   * Create a review for a user
   * @param userId - ID of the user being reviewed
   * @param reviewData - Object containing rating and comment
   * @returns Promise with the API response
   */
  createReview: async (
    userId: number,
    reviewData: {
      rating: number;
      comment: string;
    }
  ) => {
    try {
      const response = await axiosInstance.post(
        USER_ENDPOINTS.REVIEWS(userId),
        reviewData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  /**
   * Update user salary
   * @param userId - ID of the user whose salary is being updated
   * @param salaryData - Object containing salary, change_reason, and effective_date
   * @returns Promise with the API response
   */
  updateSalary: async (
    userId: number,
    salaryData: {
      salary: number;
      change_reason: string;
      effective_date: string;
    }
  ) => {
    try {
      const response = await axiosInstance.patch(
        USER_ENDPOINTS.SALARY(userId),
        salaryData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating salary:', error);
      throw error;
    }
  },
};

export default userApi;
