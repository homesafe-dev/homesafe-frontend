import axiosInstance from './axiosConfig';

// Resources API endpoints
const RESOURCES_ENDPOINTS = {
  LEARNING_RESOURCES: '/learning-resources',
  RECOMMEND_RESOURCE: '/learning-resources/recommend',
};

// Resources API service
const resourcesApi = {
  /**
   * Get learning resources
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @returns Promise with the API response containing learning resources data
   */
  getLearningResources: async (page = 1, limit = 15) => {
    try {
      const response = await axiosInstance.get(
        RESOURCES_ENDPOINTS.LEARNING_RESOURCES,
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching learning resources:', error);
      throw error;
    }
  },

  /**
   * Get learning resources by occupation ID
   * @param occupationId - ID of the occupation to filter by
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @returns Promise with the API response containing filtered learning resources data
   */
  getLearningResourcesByOccupation: async (
    occupationId: number,
    page = 1,
    limit = 15
  ) => {
    try {
      const response = await axiosInstance.get(
        RESOURCES_ENDPOINTS.LEARNING_RESOURCES,
        {
          params: { occupation_id: occupationId, page, limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching learning resources by occupation:', error);
      throw error;
    }
  },

  /**
   * Recommend a learning resource to a user
   * @param userId - ID of the user to recommend the resource to
   * @param learningResourceId - ID of the learning resource to recommend
   * @returns Promise with the API response
   */
  recommendResource: async (userId: number, learningResourceId: number) => {
    try {
      const response = await axiosInstance.post(
        `${RESOURCES_ENDPOINTS.RECOMMEND_RESOURCE}?user`,
        {
          user_ids: [userId], // Send as array
          learning_resource_id: learningResourceId,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error recommending resource:', error);
      throw error;
    }
  },
};

export default resourcesApi;
