import axiosInstance from './axiosConfig';

// Employer API endpoints
const EMPLOYER_ENDPOINTS = {
  EMPLOYEES: '/api/employer/employees',
  EMPLOYEE_DETAILS: '/api/employer/employees', // Append /{id} for specific employee
  ADD_EMPLOYEE: '/api/employer/employees',
  REMOVE_EMPLOYEE: '/api/employer/employees', // Append /{id} for specific employee
  UPDATE_EMPLOYEE: '/api/employer/employees', // Append /{id} for specific employee
};

// Employer API service
const employerApi = {
  /**
   * Get all employees for the employer
   * @returns Promise with the API response
   */
  getEmployees: async () => {
    try {
      const response = await axiosInstance.get(EMPLOYER_ENDPOINTS.EMPLOYEES);
      console.log('Raw API response:', response);
      return response.data;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  /**
   * Get details of a specific employee
   * @param employeeId - ID of the employee
   * @returns Promise with the API response
   */
  getEmployeeDetails: async (employeeId: number) => {
    const response = await axiosInstance.get(
      `${EMPLOYER_ENDPOINTS.EMPLOYEE_DETAILS}/${employeeId}`
    );
    return response.data;
  },

  /**
   * Add a new employee
   * @param employeeData - Employee data to add
   * @returns Promise with the API response
   */
  addEmployee: async (employeeData: Record<string, unknown>) => {
    const response = await axiosInstance.post(
      EMPLOYER_ENDPOINTS.ADD_EMPLOYEE,
      employeeData
    );
    return response.data;
  },

  /**
   * Update an employee's details
   * @param employeeId - ID of the employee to update
   * @param employeeData - Updated employee data
   * @returns Promise with the API response
   */
  updateEmployee: async (
    employeeId: number,
    employeeData: Record<string, unknown>
  ) => {
    const response = await axiosInstance.put(
      `${EMPLOYER_ENDPOINTS.UPDATE_EMPLOYEE}/${employeeId}`,
      employeeData
    );
    return response.data;
  },

  /**
   * Remove an employee
   * @param employeeId - ID of the employee to remove
   * @returns Promise with the API response
   */
  removeEmployee: async (employeeId: number) => {
    const response = await axiosInstance.delete(
      `${EMPLOYER_ENDPOINTS.REMOVE_EMPLOYEE}/${employeeId}`
    );
    return response.data;
  },
};

export default employerApi;
