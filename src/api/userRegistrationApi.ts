import axiosInstance from './axiosConfig';

// User registration API endpoints
const USER_REGISTRATION_ENDPOINTS = {
  REGISTER_USER: '/admin/register-user',
};

// User registration interfaces
export interface UserRegistrationData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  salary: number;
  role: 'agent' | 'employee' | 'employer' | 'admin';
  occupations: number[];
  agent_id?: number;
  employer_id?: number;
}

export interface UserRegistrationResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    salary: string;
    created_at: string;
    updated_at: string;
  };
}

// User registration API service
const userRegistrationApi = {
  /**
   * Register a new user (Agent, Employee, Employer, or Admin)
   * @param userData - User registration data
   * @returns Promise with the API response
   */
  registerUser: async (
    userData: UserRegistrationData
  ): Promise<UserRegistrationResponse> => {
    try {
      const response = await axiosInstance.post(
        USER_REGISTRATION_ENDPOINTS.REGISTER_USER,
        userData
      );

      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  /**
   * Register a new agent
   * @param agentData - Agent registration data
   * @returns Promise with the API response
   */
  registerAgent: async (
    agentData: Omit<UserRegistrationData, 'role' | 'agent_id' | 'employer_id'>
  ): Promise<UserRegistrationResponse> => {
    return userRegistrationApi.registerUser({
      ...agentData,
      role: 'agent',
      salary: agentData.salary || 0,
    });
  },

  /**
   * Register a new employee
   * @param employeeData - Employee registration data
   * @returns Promise with the API response
   */
  registerEmployee: async (
    employeeData: Omit<UserRegistrationData, 'role'> & {
      agent_id: number;
      employer_id: number;
    }
  ): Promise<UserRegistrationResponse> => {
    return userRegistrationApi.registerUser({
      ...employeeData,
      role: 'employee',
    });
  },

  /**
   * Register a new employer
   * @param employerData - Employer registration data
   * @returns Promise with the API response
   */
  registerEmployer: async (
    employerData: Omit<
      UserRegistrationData,
      'role' | 'agent_id' | 'employer_id'
    >
  ): Promise<UserRegistrationResponse> => {
    return userRegistrationApi.registerUser({
      ...employerData,
      role: 'employer',
      salary: employerData.salary || 0,
    });
  },

  /**
   * Register a new admin
   * @param adminData - Admin registration data
   * @returns Promise with the API response
   */
  registerAdmin: async (
    adminData: Omit<UserRegistrationData, 'role' | 'agent_id' | 'employer_id'>
  ): Promise<UserRegistrationResponse> => {
    return userRegistrationApi.registerUser({
      ...adminData,
      role: 'admin',
      salary: adminData.salary || 0,
    });
  },
};

export default userRegistrationApi;
