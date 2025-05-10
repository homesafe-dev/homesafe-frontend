import axiosInstance from './axiosConfig';

// Agent API endpoints
const AGENT_ENDPOINTS = {
  TRACK_EMPLOYEES: '/api/agent/track/employees',
  REGISTER_CANDIDATE: '/api/register',
};

// Mock occupations data (in a real app, this would come from an API)
export const OCCUPATIONS = [
  { id: 1, name: 'Housekeeper/Maid' },
  { id: 2, name: 'Cook/Chef' },
  { id: 3, name: 'Childcare Provider' },
  { id: 4, name: 'Gardener/Groundskeeper' },
  { id: 5, name: 'Driver' },
  { id: 6, name: 'Security Guard' },
  { id: 7, name: 'Personal Assistant' },
  { id: 8, name: 'Nurse/Caregiver' },
];

// Agent API service
const agentApi = {
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
