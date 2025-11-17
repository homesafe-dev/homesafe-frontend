import axiosInstance from './axiosConfig';

// Dashboard API service
const dashboardApi = {
  /**
   * Get dashboard data for the current user (role-specific)
   * @param filters - Optional filters for transactions, notifications, etc.
   * @returns Promise with the API response
   */
  getDashboard: async (filters?: Record<string, string | number>) => {
    try {
      const params = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });
      }

      const queryString = params.toString();
      const url = queryString ? `/dashboard?${queryString}` : '/dashboard';

      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },
};

export default dashboardApi;
