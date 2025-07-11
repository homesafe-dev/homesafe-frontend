import axiosInstance from './axiosConfig';

// Environment API endpoints
const ENVIRONMENT_ENDPOINTS = {
  APP_ENVIRONMENT: '/app-environment',
};

// Environment API response interface
export interface EnvironmentResponse {
  app_environment: string;
}

// Environment API service
const environmentApi = {
  /**
   * Get application environment information
   * @returns Promise with the API response containing environment data
   */
  getAppEnvironment: async (): Promise<EnvironmentResponse> => {
    try {
      const response = await axiosInstance.get(
        ENVIRONMENT_ENDPOINTS.APP_ENVIRONMENT
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching app environment:', error);
      throw error;
    }
  },
};

export default environmentApi;
