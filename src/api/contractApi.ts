import axiosInstance from './axiosConfig';

// Contract API endpoints
const CONTRACT_ENDPOINTS = {
  SEND_PROPOSAL: '/contracts/send/proposal',
  GET_CONTRACTS: '/contracts',
  GET_CONTRACT_DETAILS: '/contracts',
  UPDATE_CONTRACT: '/contracts',
  TERMINATE_CONTRACT: '/contracts/terminate',
  GET_PROPOSALS: '/contracts/proposals',
  GET_SINGLE_PROPOSAL: '/contracts',
  RESPOND_TO_PROPOSAL: '/contracts/proposals',
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

  /**
   * Get contract proposals
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @returns Promise with the API response containing contract proposals
   */
  getProposals: async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get(
        CONTRACT_ENDPOINTS.GET_PROPOSALS,
        {
          params: { page, limit },
        }
      );

      // Log the response structure for debugging
      console.log(
        'Contract proposals API response:',
        JSON.stringify(response.data, null, 2)
      );

      // Handle the new API response structure
      if (response.data && response.data.status) {
        // Check if data.data exists and contains an array
        if (response.data.data && Array.isArray(response.data.data.data)) {
          // Flatten the array of arrays into a single array of proposal objects
          const flattenedData = response.data.data.data.flat();
          console.log('Flattened data:', flattenedData);

          // Return the same structure as before but with flattened data
          return {
            ...response.data,
            data: flattenedData,
          };
        } else {
          console.warn(
            'Unexpected data structure in API response:',
            response.data
          );
          // If we can't find the expected structure, return an empty array for data
          // to prevent errors in the UI
          return {
            ...response.data,
            data: [],
          };
        }
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching contract proposals:', error);
      throw error;
    }
  },

  /**
   * Get single proposal details by contract ID
   * @param contractId - ID of the contract
   * @returns Promise with the API response containing proposal details
   */
  getSingleProposal: async (contractId: number) => {
    try {
      const response = await axiosInstance.get(
        `${CONTRACT_ENDPOINTS.GET_SINGLE_PROPOSAL}/${contractId}/proposal`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching single proposal:', error);
      throw error;
    }
  },

  /**
   * Respond to a proposal (accept or decline)
   * @param proposalId - ID of the proposal
   * @param action - 'accept' or 'decline'
   * @returns Promise with the API response
   */
  respondToProposal: async (proposalId: number, action: 'accept' | 'decline') => {
    try {
      const response = await axiosInstance.post(
        `${CONTRACT_ENDPOINTS.RESPOND_TO_PROPOSAL}/${proposalId}/respond`,
        { response: action === 'accept' ? 'accepted' : 'declined' }
      );
      return response.data;
    } catch (error) {
      console.error('Error responding to proposal:', error);
      throw error;
    }
  },
};

export default contractApi;
