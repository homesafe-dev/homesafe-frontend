import axiosInstance from './axiosConfig';

// Payroll API endpoints
const PAYROLL_ENDPOINTS = {
  PAYROLL_HISTORY: '/payroll-history',
  CREATE_PAYROLL: '/create-payroll',
  UPDATE_PAYROLL: '/update-payroll',
  DELETE_PAYROLL: '/delete-payroll',
};

// Payroll API service
const payrollApi = {
  /**
   * Get payroll history
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @returns Promise with the API response
   */
  getPayrollHistory: async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get(
        PAYROLL_ENDPOINTS.PAYROLL_HISTORY,
        {
          params: { page, limit },
        }
      );
    
      return response.data;
    } catch (error) {
      console.error('Payroll API error:', error);
      throw error;
    }
  },

  /**
   * Create a new payroll entry
   * @param payrollData - Payroll data to create
   * @returns Promise with the API response
   */
  createPayroll: async (payrollData: Record<string, unknown>) => {
    const response = await axiosInstance.post(
      PAYROLL_ENDPOINTS.CREATE_PAYROLL,
      payrollData
    );
    return response.data;
  },

  /**
   * Update a payroll entry
   * @param payrollId - ID of the payroll entry to update
   * @param payrollData - Updated payroll data
   * @returns Promise with the API response
   */
  updatePayroll: async (
    payrollId: number,
    payrollData: Record<string, unknown>
  ) => {
    const response = await axiosInstance.put(
      `${PAYROLL_ENDPOINTS.UPDATE_PAYROLL}/${payrollId}`,
      payrollData
    );
    return response.data;
  },

  /**
   * Delete a payroll entry
   * @param payrollId - ID of the payroll entry to delete
   * @returns Promise with the API response
   */
  deletePayroll: async (payrollId: number) => {
    const response = await axiosInstance.delete(
      `${PAYROLL_ENDPOINTS.DELETE_PAYROLL}/${payrollId}`
    );
    return response.data;
  },
};

export default payrollApi;
