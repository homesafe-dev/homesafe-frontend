import React, { useState, useEffect } from 'react';
import walletApi from '../../api/walletApi';

interface TransactionUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

interface TransactionDetails {
  id: number;
  reference_code: string;
  type: string;
  status: string;
  amount: string;
  category: string;
}

interface ApiTransaction {
  id: number;
  type: string;
  source: string;
  description: string;
  user: TransactionUser;
  recipient?: TransactionUser;
  transaction: TransactionDetails;
}

interface Transaction {
  id: string;
  type: string;
  date: string;
  amount: number;
  description: string;
  from: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

const Salary: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 15
  });

  useEffect(() => {
    fetchTransactions(1);
  }, []);

  const fetchTransactions = async (page: number) => {
    try {
      setLoading(true);
      const response = await walletApi.getTransactions(page);

      if (response.status) {
        // Transform API data to match our component's expected format
        const formattedTransactions = response.data.data.map((item: ApiTransaction) => {
          // Format date - assuming we need to create a date string
          // In a real app, the API might provide a timestamp we'd format
          const date = new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });

          return {
            id: item.transaction.reference_code,
            type: item.type === 'credit' ? 'Credit' : 'Debit',
            date: date,
            amount: parseFloat(item.transaction.amount),
            description: item.description,
            from: item.recipient ?
              `${item.recipient.first_name} ${item.recipient.last_name}` :
              (item.source === 'salary' ? 'Employer' : item.source)
          };
        });

        setTransactions(formattedTransactions);

        // Set pagination data
        if (response.data.meta) {
          setPagination({
            current_page: response.data.meta.current_page,
            last_page: response.data.meta.last_page,
            total: response.data.meta.total,
            per_page: response.data.meta.per_page
          });
        }
      } else {
        setError('Failed to fetch transactions');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Error fetching transactions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fallback data in case API fails or returns empty
  const fallbackTransactions: Transaction[] = [
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'November Salary',
      from: 'Homesafe',
    }
  ];

  return (
    <div className="rounded-lg border-gray-200">
      <div className="flex items-center mb-1">
        <h1 className="text-[20px] font-semibold text-[#24292E]">Salary</h1>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[16px] text-[#24292E] font-semibold mt-[1rem]">
          Transaction History
        </h2>
        {pagination.last_page > 1 && (
          <div className="flex space-x-2">
            <button
              onClick={() => fetchTransactions(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className={`px-3 py-1 rounded ${
                pagination.current_page === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#A5EA91] text-gray-700 hover:bg-green-200'
              }`}
            >
              Previous
            </button>
            <span className="px-3 py-1">
              Page {pagination.current_page} of {pagination.last_page}
            </span>
            <button
              onClick={() => fetchTransactions(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className={`px-3 py-1 rounded ${
                pagination.current_page === pagination.last_page
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#A5EA91] text-gray-700 hover:bg-green-200'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="py-3 px-2 bg-[#A5EA91]">Transaction Type</th>
                <th className="py-3 px-2 bg-[#A5EA91]">Transaction ID</th>
                <th className="py-3 px-2 bg-[#A5EA91]">Date</th>
                <th className="py-3 px-2 bg-[#A5EA91]">Amount</th>
                <th className="py-3 px-2 bg-[#A5EA91]">Description</th>
                <th className="py-3 px-2 bg-[#A5EA91]">From/To</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-2">{transaction.type}</td>
                    <td className="py-3 px-2">{transaction.id}</td>
                    <td className="py-3 px-2">{transaction.date}</td>
                    <td className="py-3 px-2">
                      ₦ {transaction.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-2">{transaction.description}</td>
                    <td className="py-3 px-2">{transaction.from}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Salary;
