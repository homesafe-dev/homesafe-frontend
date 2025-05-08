import axiosInstance from './axiosConfig';

// Artisan API endpoints
const ARTISAN_ENDPOINTS = {
  EMPLOYEE_LIST: '/api/employee-list',
};

// Artisan API service
const artisanApi = {
  /**
   * Get all employees/artisans
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @returns Promise with the API response
   */
  getEmployeeList: async (page = 1, limit = 15) => {
    try {
      const response = await axiosInstance.get(ARTISAN_ENDPOINTS.EMPLOYEE_LIST, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching employee list:', error);
      throw error;
    }
  },

  /**
   * Get details of a specific employee/artisan by ID
   * This uses the employee list API and filters for the specific employee
   * @param employeeId - ID of the employee
   * @returns Promise with the API response containing the specific employee
   */
  getEmployeeById: async (employeeId: number) => {
    try {
      // Get all employees (with a high limit to ensure we get the one we need)
      const response = await axiosInstance.get(ARTISAN_ENDPOINTS.EMPLOYEE_LIST, {
        params: { page: 1, limit: 100 },
      });

      if (response.data.status && response.data.data && response.data.data.data) {
        // Find the employee with the matching ID
        const employee = response.data.data.data.find((emp: any) => emp.id === employeeId);

        if (employee) {
          return {
            status: true,
            message: "Employee found",
            data: employee
          };
        } else {
          return {
            status: false,
            message: "Employee not found",
            data: null
          };
        }
      }

      return {
        status: false,
        message: "Failed to find employee",
        data: null
      };
    } catch (error) {
      console.error('Error fetching employee by ID:', error);
      throw error;
    }
  },
};

export default artisanApi;
