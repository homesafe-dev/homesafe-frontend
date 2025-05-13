import axiosInstance from './axiosConfig';

// Agent API endpoints
const AGENT_ENDPOINTS = {
  TRACK_EMPLOYEES: '/agent/track/employees',
  REGISTER_CANDIDATE: '/register',
  OCCUPATIONS: '/occupations',
};

// Agent API service
const agentApi = {
  /**
   * Get occupations list from the API
   * @returns Promise with the API response containing occupations data
   */
  getOccupations: async () => {
    try {
      const response = await axiosInstance.get(AGENT_ENDPOINTS.OCCUPATIONS);
      return response.data;
    } catch (error) {
      console.error('Error fetching occupations:', error);
      throw error;
    }
  },

  /**
   * Get tracked employees for agent dashboard
   * @returns Promise with the API response containing tracked employees data
   */
  getTrackedEmployees: async () => {
    try {
      const response = await axiosInstance.get(AGENT_ENDPOINTS.TRACK_EMPLOYEES);
      return response.data;
    } catch (error) {
      console.error('Error fetching tracked employees:', error);
      throw error;
    }
  },

  /**
   * Register a new candidate
   * @param candidateData - Candidate registration data
   * @param photo - Optional photo file
   * @returns Promise with the API response
   */
  registerCandidate: async (
    candidateData: {
      email: string;
      first_name: string;
      last_name: string;
      password: string;
      dob: string;
      address: string;
      salary: string;
      occupations: number[];
      gender?: string;
      phone?: string;
    },
    photo?: File | null
  ) => {
    try {
      // Create FormData to handle file upload
      const formData = new FormData();

      // Add all candidate data to FormData
      Object.entries(candidateData).forEach(([key, value]) => {
        if (key === 'occupations' && Array.isArray(value)) {
          // Handle occupations array
          value.forEach((occupation) => {
            formData.append(`occupations[]`, occupation.toString());
          });
        } else {
          formData.append(key, value as string);
        }
      });

      // Add photo if provided
      if (photo) {
        formData.append('avatar', photo);
      }

      // Set headers for multipart/form-data
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await axiosInstance.post(
        AGENT_ENDPOINTS.REGISTER_CANDIDATE,
        formData,
        config
      );
      return response.data;
    } catch (error) {
      console.error('Error registering candidate:', error);
      throw error;
    }
  },
};

export default agentApi;
