import axiosInstance from './axiosConfig';

// Transaction API endpoints
const TRANSACTION_ENDPOINTS = {
  ADMIN_TRANSACTIONS: '/admin/transactions',
};

// Transaction filter types
export interface TransactionFilters {
  limit?: number;
  type?:
    | 'wallet_deposit'
    | 'wallet_withdrawal'
    | 'salary_payment'
    | 'external_funding';
  status?: 'successful' | 'pending' | 'failed';
  payment_method?: 'external_funding' | 'wallet_transfer' | 'bank_transfer';
  wallet_source?: 'top-up' | 'salary' | 'withdrawal';
  from_date?: string;
  to_date?: string;
  search?: string;
  sort_by?: 'amount' | 'created_at' | 'status';
  sort_order?: 'asc' | 'desc';
  page?: number;
}

// Transaction interface based on API response
export interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  currency: string;
  status: 'successful' | 'pending' | 'failed';
  payment_method: string;
  wallet_source?: string;
  reference: string;
  description: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface TransactionResponse {
  status: boolean;
  message: string;
  data: {
    transactions: Transaction[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      items_per_page: number;
    };
  };
}

// Transaction API service
const transactionApi = {
  /**
   * Get all transactions with filters (Admin)
   * @param filters - Filter options for transactions
   * @returns Promise with the API response
   */
  getAllTransactions: async (
    filters: TransactionFilters = {}
  ): Promise<TransactionResponse> => {
    try {
      const params = new URLSearchParams();

      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axiosInstance.get(
        `${TRANSACTION_ENDPOINTS.ADMIN_TRANSACTIONS}?${params.toString()}`
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  /**
   * Filter transactions by type
   * @param type - Transaction type
   * @param status - Transaction status (optional)
   * @param additionalFilters - Additional filter options
   * @returns Promise with the API response
   */
  filterByType: async (
    type: TransactionFilters['type'],
    status?: TransactionFilters['status'],
    additionalFilters: Omit<TransactionFilters, 'type' | 'status'> = {}
  ): Promise<TransactionResponse> => {
    return transactionApi.getAllTransactions({
      type,
      status,
      ...additionalFilters,
    });
  },

  /**
   * Filter transactions by payment method
   * @param payment_method - Payment method
   * @param from_date - Start date (optional)
   * @param additionalFilters - Additional filter options
   * @returns Promise with the API response
   */
  filterByPaymentMethod: async (
    payment_method: TransactionFilters['payment_method'],
    from_date?: string,
    additionalFilters: Omit<
      TransactionFilters,
      'payment_method' | 'from_date'
    > = {}
  ): Promise<TransactionResponse> => {
    return transactionApi.getAllTransactions({
      payment_method,
      from_date,
      ...additionalFilters,
    });
  },

  /**
   * Search transactions
   * @param search - Search term
   * @param sort_by - Sort field (optional)
   * @param sort_order - Sort order (optional)
   * @param additionalFilters - Additional filter options
   * @returns Promise with the API response
   */
  searchTransactions: async (
    search: string,
    sort_by?: TransactionFilters['sort_by'],
    sort_order?: TransactionFilters['sort_order'],
    additionalFilters: Omit<
      TransactionFilters,
      'search' | 'sort_by' | 'sort_order'
    > = {}
  ): Promise<TransactionResponse> => {
    return transactionApi.getAllTransactions({
      search,
      sort_by,
      sort_order,
      ...additionalFilters,
    });
  },

  /**
   * Filter by wallet source
   * @param wallet_source - Wallet source
   * @param to_date - End date (optional)
   * @param additionalFilters - Additional filter options
   * @returns Promise with the API response
   */
  filterByWalletSource: async (
    wallet_source: TransactionFilters['wallet_source'],
    to_date?: string,
    additionalFilters: Omit<
      TransactionFilters,
      'wallet_source' | 'to_date'
    > = {}
  ): Promise<TransactionResponse> => {
    return transactionApi.getAllTransactions({
      wallet_source,
      to_date,
      ...additionalFilters,
    });
  },

  /**
   * Filter transactions by date range
   * @param from_date - Start date
   * @param to_date - End date
   * @param additionalFilters - Additional filter options
   * @returns Promise with the API response
   */
  filterByDateRange: async (
    from_date: string,
    to_date: string,
    additionalFilters: Omit<TransactionFilters, 'from_date' | 'to_date'> = {}
  ): Promise<TransactionResponse> => {
    return transactionApi.getAllTransactions({
      from_date,
      to_date,
      ...additionalFilters,
    });
  },
};

export default transactionApi;
