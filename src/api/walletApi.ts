import axiosInstance from './axiosConfig';

// Wallet API endpoints
const WALLET_ENDPOINTS = {
  TRANSACTIONS: '/api/wallet/transactions',
  BALANCE: '/api/wallet',
  TOP_UP: '/api/wallet/top-up',
  WITHDRAW: '/api/wallet/withdraw',
  TRANSFER: '/api/wallet/transfer',
};

// Wallet API service
const walletApi = {
  /**
   * Get wallet transactions
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @returns Promise with the API response
   */
  getTransactions: async (page = 1, limit = 15) => {
    const response = await axiosInstance.get(WALLET_ENDPOINTS.TRANSACTIONS, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get wallet balance
   * @returns Promise with the API response containing wallet details
   */
  getBalance: async () => {
    try {
      const response = await axiosInstance.get(WALLET_ENDPOINTS.BALANCE);
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      throw error;
    }
  },

  /**
   * Top up wallet
   * @param amount - Amount to top up
   * @param paymentMethod - Payment method (e.g., 'card', 'transfer')
   * @param paymentDetails - Additional payment details
   * @returns Promise with the API response
   */
  topUp: async (
    amount: number,
    paymentMethod: string,
    paymentDetails: Record<string, unknown>
  ) => {
    const response = await axiosInstance.post(WALLET_ENDPOINTS.TOP_UP, {
      amount,
      payment_method: paymentMethod,
      payment_details: paymentDetails,
    });
    return response.data;
  },

  /**
   * Withdraw from wallet
   * @param amount - Amount to withdraw
   * @param bankDetails - Bank details for withdrawal
   * @returns Promise with the API response
   */
  withdraw: async (amount: number, bankDetails: Record<string, unknown>) => {
    const response = await axiosInstance.post(WALLET_ENDPOINTS.WITHDRAW, {
      amount,
      bank_details: bankDetails,
    });
    return response.data;
  },

  /**
   * Transfer to another user
   * @param amount - Amount to transfer
   * @param recipientEmail - Email of the recipient
   * @param description - Description of the transfer
   * @returns Promise with the API response
   */
  transfer: async (
    amount: number,
    recipientEmail: string,
    description: string
  ) => {
    const response = await axiosInstance.post(WALLET_ENDPOINTS.TRANSFER, {
      amount,
      recipient_email: recipientEmail,
      description,
    });
    return response.data;
  },
};

export default walletApi;
