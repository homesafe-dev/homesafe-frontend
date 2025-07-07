import axiosInstance from './axiosConfig';

// Admin API endpoints
const ADMIN_ENDPOINTS = {
  EMPLOYER_LIST: '/users',
  EMPLOYEE_LIST: '/users',
  AGENT_LIST: '/users',
  APPROVE_USER: '/admin/approve-user', // Endpoint to approve a user
  DECLINE_USER: '/admin/decline-user', // Endpoint to decline a user
  UNAPPROVED_USERS: '/admin/unapproved-users', // Endpoint to get unapproved users
  TRACK_EMPLOYEES: '/users', // Using unified users endpoint for tracking employees
  BLOCK_USER: '/admin/block-user', // Endpoint to block a user
  UNBLOCK_USER: '/admin/unblock-user', // Endpoint to unblock a user
  SUSPEND_USER: '/admin/suspend-user', // Endpoint to suspend a user
  OCCUPATIONS: '/occupations', // Endpoint to get occupations
  TRANSACTIONS: '/admin/transactions', // Endpoint to get transactions
};

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  title?: string;
  email: string;
  avatar?: string;
  created_at: string;
  employer?: {
    name: string;
  };
  gender: string;
  phone: string;
  is_verified: boolean;
  approval_status?: string;
  is_blocked?: boolean;
  average_rating?: number;
  occupations?: any[];
  reviews?: any[];
  user_medicals?: any[];
}

// Admin API service
const adminApi = {
  /**
   * Get all employers
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @returns Promise with the API response
   */
  getEmployerList: async (page = 1, limit = 15) => {
    try {
      const response = await axiosInstance.get(ADMIN_ENDPOINTS.EMPLOYER_LIST, {
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
   * Get all employees
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @returns Promise with the API response
   */
  getEmployeeList: async (page = 1, limit = 15) => {
    try {
      const response = await axiosInstance.get(ADMIN_ENDPOINTS.EMPLOYEE_LIST, {
        params: {
          role: 'employee',
          page,
          limit,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching employee list:', error);
      throw error;
    }
  },

  /**
   * Get occupations list from the API
   * @returns Promise with the API response containing occupations data
   */
  getOccupations: async () => {
    try {
      const response = await axiosInstance.get(ADMIN_ENDPOINTS.OCCUPATIONS);
      return response.data;
    } catch (error) {
      console.error('Error fetching occupations:', error);
      throw error;
    }
  },

  /**
   * Get all agents
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @returns Promise with the API response
   */
  getAgentList: async (page = 1, limit = 20) => {
    try {
      const response = await axiosInstance.get(ADMIN_ENDPOINTS.AGENT_LIST, {
        params: {
          role: 'agent',
          page,
          limit,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching agent list:', error);
      throw error;
    }
  },

  /**
   * Get all admins
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @returns Promise with the API response
   */
  getAdminList: async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get('/users', {
        params: {
          role: 'admin',
          page,
          limit,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching admin list:', error);
      throw error;
    }
  },

  /**
   * Approve a user
   * @param userId - The ID of the user to approve
   * @returns Promise with the API response
   */
  approveUser: async (userId: string | number) => {
    try {
      const response = await axiosInstance.post(
        `${ADMIN_ENDPOINTS.APPROVE_USER}/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error approving user:', error);
      throw error;
    }
  },

  /**
   * Decline a user
   * @param userId - The ID of the user to decline
   * @returns Promise with the API response
   */
  declineUser: async (userId: string | number) => {
    try {
      const response = await axiosInstance.post(
        `${ADMIN_ENDPOINTS.DECLINE_USER}/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error declining user:', error);
      throw error;
    }
  },

  /**
   * Get all unapproved users (incoming requests)
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @returns Promise with the API response
   */
  getUnapprovedUsers: async (page = 1, limit = 15) => {
    try {
      const response = await axiosInstance.get(
        ADMIN_ENDPOINTS.UNAPPROVED_USERS,
        {
          params: { page, limit },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching unapproved users:', error);
      throw error;
    }
  },

  /**
   * Get tracked employees for admin dashboard
   * @returns Promise with the API response containing tracked employees data
   */
  getTrackedEmployees: async (page = 1, limit = 15) => {
    try {
      const response = await axiosInstance.get(
        ADMIN_ENDPOINTS.TRACK_EMPLOYEES,
        {
          params: {
            role: 'employee',
            page,
            limit,
          },
        }
      );

      if (
        response.data.status &&
        response.data.data &&
        response.data.data.data
      ) {
        const employeesArray = response.data.data.data as Employee[];

        const transformedData = employeesArray.map((employee: Employee) => ({
          id: employee.id,
          candidate: `${employee.first_name} ${employee.last_name}`,
          title: employee.title || 'Staff',
          email: employee.email,
          avatar: employee.avatar,
          date: employee.created_at,
          placement: employee.employer
            ? `${employee.employer.name}`
            : 'No employer assigned',
          gender: employee.gender,
          phone: employee.phone,
          is_verified: employee.is_verified,
          approval_status: employee.approval_status,
          is_blocked: employee.is_blocked,
          status: employee.is_verified ? 'Verified' : 'Unverified', // Keep for backward compatibility
        }));

        return {
          status: response.data.status,
          message: response.data.message,
          data: transformedData,
        };
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching tracked employees:', error);
      throw error;
    }
  },

  /**
   * Get employee details by ID
   * @param employeeId - ID of the employee
   * @returns Promise with the API response containing employee details
   */
  getEmployeeById: async (employeeId: string | number) => {
    try {
      const response = await axiosInstance.get(ADMIN_ENDPOINTS.EMPLOYEE_LIST, {
        params: {
          role: 'employee',
          page: 1,
          limit: 100,
        },
      });

      if (
        response.data.status &&
        response.data.data &&
        response.data.data.data
      ) {
        const employeesArray = response.data.data.data as Employee[];

        const employee = employeesArray.find(
          (emp: Employee) => emp.id === parseInt(employeeId as string)
        );

        if (employee) {
          const transformedEmployee = {
            id: employee.id,
            candidate: `${employee.first_name} ${employee.last_name}`,
            title: employee.title || 'Staff',
            email: employee.email,
            avatar: employee.avatar,
            date: employee.created_at,
            placement: employee.employer
              ? `${employee.employer.name}`
              : 'No employer assigned',
            gender: employee.gender,
            phone: employee.phone,
            is_verified: employee.is_verified,
            approval_status: employee.approval_status,
            is_blocked: employee.is_blocked,
            status: employee.is_verified ? 'Verified' : 'Unverified', // Keep for backward compatibility
            average_rating: employee.average_rating,
            occupations: employee.occupations || [],
            reviews: employee.reviews
              ? employee.reviews.map((review) => ({
                  ...review,
                  date: review.created_at, // Map created_at to date for consistency
                }))
              : [],
            user_medicals: employee.user_medicals || [],
          };

          return {
            status: true,
            message: 'Employee found',
            data: transformedEmployee,
          };
        }
      }

      return {
        status: false,
        message: 'Employee not found',
        data: null,
      };
    } catch (error) {
      console.error('Error fetching employee details:', error);
      throw error;
    }
  },

  /**
   * Block a user
   * @param userId - The ID of the user to block
   * @returns Promise with the API response
   */
  blockUser: async (userId: string | number) => {
    try {
      const response = await axiosInstance.post(
        `${ADMIN_ENDPOINTS.BLOCK_USER}/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  },

  /**
   * Unblock a user
   * @param userId - The ID of the user to unblock
   * @returns Promise with the API response
   */
  unblockUser: async (userId: string | number) => {
    try {
      const response = await axiosInstance.post(
        `${ADMIN_ENDPOINTS.UNBLOCK_USER}/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw error;
    }
  },

  /**
   * Suspend a user
   * @param userId - The ID of the user to suspend
   * @returns Promise with the API response
   */
  suspendUser: async (userId: string | number) => {
    try {
      const response = await axiosInstance.post(
        `${ADMIN_ENDPOINTS.SUSPEND_USER}/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error suspending user:', error);
      throw error;
    }
  },

  /**
   * Get all transactions with filters (Admin)
   * @param filters - Filter options for transactions
   * @returns Promise with the API response
   */
  getTransactions: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axiosInstance.get(
        `${ADMIN_ENDPOINTS.TRANSACTIONS}?${params.toString()}`
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },
};

export default adminApi;
