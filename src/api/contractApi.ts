import axiosInstance from './axiosConfig';

// Contract API endpoints
const CONTRACT_ENDPOINTS = {
  SEND_PROPOSAL: '/contracts/send/proposal',
  GET_CONTRACTS: '/contracts',
  GET_CONTRACT_DETAILS: '/contracts',
  UPDATE_CONTRACT: '/contracts',
  TERMINATE_CONTRACT: '/contracts/terminate',
};

// Contract API service
const contractApi = {
  /**
   * Send a contract proposal to an employee
   * @param proposalData - Contract proposal data
   * @returns Promise with the API response
   */
  sendProposal: async (proposalData: {
    employee_id: number;
    working_days_per_month: number;
    working_hours_per_week: number;
    working_hours_schedule: string;
    start_date: string;
    duration_months: number;
    position?: string;
  }) => {
    try {
      const response = await axiosInstance.post(
        CONTRACT_ENDPOINTS.SEND_PROPOSAL,
        proposalData
      );
      return response.data;
    } catch (error) {
      console.error('Error sending contract proposal:', error);
      throw error;
    }
  },

  /**
   * Get all contracts
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @returns Promise with the API response
   */
  getContracts: async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get(
        CONTRACT_ENDPOINTS.GET_CONTRACTS,
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    }
  },

  /**
   * Get contract details
   * @param contractId - ID of the contract
   * @returns Promise with the API response
   */
  getContractDetails: async (contractId: number) => {
    try {
      const response = await axiosInstance.get(
        `${CONTRACT_ENDPOINTS.GET_CONTRACT_DETAILS}/${contractId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching contract details:', error);
      throw error;
    }
  },

  /**
   * Update a contract
   * @param contractId - ID of the contract to update
   * @param contractData - Updated contract data
   * @returns Promise with the API response
   */
  updateContract: async (contractId: number, contractData: any) => {
    try {
      const response = await axiosInstance.put(
        `${CONTRACT_ENDPOINTS.UPDATE_CONTRACT}/${contractId}`,
        contractData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating contract:', error);
      throw error;
    }
  },

  /**
   * Terminate a contract
   * @param contractId - ID of the contract to terminate
   * @param terminationData - Termination data including reason and notice period
   * @returns Promise with the API response
   */
  terminateContract: async (
    contractId: number,
    terminationData: { reason: string; notice_period: string }
  ) => {
    try {
      const response = await axiosInstance.post(
        `${CONTRACT_ENDPOINTS.TERMINATE_CONTRACT}/${contractId}`,
        terminationData
      );
      return response.data;
    } catch (error) {
      console.error('Error terminating contract:', error);
      throw error;
    }
  },
};

export default contractApi;
