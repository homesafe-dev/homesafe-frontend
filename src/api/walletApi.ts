import axiosInstance from './axiosConfig';

// Wallet API endpoints
const WALLET_ENDPOINTS = {
  TRANSACTIONS: '/wallet/transactions',
  BALANCE: '/wallet',
  TOP_UP: '/wallet/top-up',
  WITHDRAW: '/wallet/withdraw',
  INITIALIZE_WITHDRAWAL: '/wallet/initialize-withdrawal',
  TRANSFER: '/wallet/transfer',
  INITIALIZE_PAYMENT: 'wallet/initialize-payment',
  VERIFY_PAYMENT: '/wallet/verify-payment',
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
   * Withdraw from wallet (Legacy)
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
   * Initialize withdrawal (New API)
   * @param amount - Amount to withdraw
   * @param bankCode - Bank code
   * @param accountNumber - Account number
   * @param accountName - Account holder name
   * @returns Promise with the API response
   */
  initializeWithdrawal: async (
    amount: number,
    bankCode: string,
    accountNumber: string,
    accountName: string
  ) => {
    try {
      const response = await axiosInstance.post(
        WALLET_ENDPOINTS.INITIALIZE_WITHDRAWAL,
        {
          amount,
          bank_code: bankCode,
          account_number: accountNumber,
          account_name: accountName,
        }
      );
      return response.data;
    } catch (error: any) {
      // Handle the expected 503 Service Unavailable response
      if (error.response?.status === 503) {
        return {
          status: false,
          message:
            error.response.data?.message ||
            'Withdrawal service is currently unavailable',
        };
      }
      throw error;
    }
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

  /**
   * Initialize Paystack payment
   * @param amount - Amount to pay
   * @param callbackUrl - URL to redirect after payment
   * @returns Promise with the API response containing authorization URL
   */
  initializePayment: async (amount: number, callbackUrl: string) => {
    const response = await axiosInstance.post(
      WALLET_ENDPOINTS.INITIALIZE_PAYMENT,
      {
        amount: parseFloat(amount.toString()),
        payment_method: 'external_funding',
        callback_url: callbackUrl,
      }
    );
    return response.data;
  },

  /**
   * Verify Paystack payment
   * @param reference - Payment reference from Paystack
   * @returns Promise with the API response
   */
  verifyPayment: async (reference: string) => {
    const response = await axiosInstance.post(WALLET_ENDPOINTS.VERIFY_PAYMENT, {
      reference,
    });
    return response.data;
  },
};

export default walletApi;
