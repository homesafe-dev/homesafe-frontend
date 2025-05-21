import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsThreeDotsVertical } from 'react-icons/bs';

// Mock transaction data
interface Transaction {
  id: string;
  name: string;
  type: string;
  transactionId: string;
  date: string;
  amount: string;
  description: string;
  status: string;
}

// Generate mock transactions with different types
const generateMockTransactions = (): Transaction[] => {
  const transactionTypes = [
    { type: 'Credit', description: 'Wallet top-up', amount: 'N 50,000' },
    { type: 'Debit', description: 'Salary payment', amount: 'N 120,000' },
    { type: 'Debit', description: 'Withdrawal', amount: 'N 75,000' }
  ];

  return Array(30).fill(null).map((_, index) => {
    const typeIndex = index % 3;
    return {
      id: `${index + 1}`,
      name: 'Johnathan James',
      type: transactionTypes[typeIndex].type,
      transactionId: `1234HY5434SU${index + 76}`,
      date: '24th Dec 2024',
      amount: transactionTypes[typeIndex].amount,
      description: transactionTypes[typeIndex].description,
      status: Math.random() > 0.2 ? 'Successful' : (Math.random() > 0.5 ? 'Pending' : 'Failed')
    };
  });
};

const mockTransactions: Transaction[] = generateMockTransactions();

const Transactions: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'top-up' | 'salaries' | 'withdrawals'>('top-up');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showOptionsFor, setShowOptionsFor] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call with mock data
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Filter transactions based on active tab
        let filteredTransactions = [...mockTransactions];
        if (activeTab === 'top-up') {
          filteredTransactions = mockTransactions.filter(t => t.description.toLowerCase().includes('top-up'));
        } else if (activeTab === 'salaries') {
          filteredTransactions = mockTransactions.filter(t => t.description.toLowerCase().includes('salary'));
        } else if (activeTab === 'withdrawals') {
          filteredTransactions = mockTransactions.filter(t => t.description.toLowerCase().includes('withdrawal'));
        }

        // Apply date filters if provided
        if (startDate && endDate) {
          // In a real app, you would parse and compare actual dates
          // For this mock, we'll just pretend the filter is applied
          console.log(`Filtering by date range: ${startDate} to ${endDate}`);
        }

        // Calculate pagination
        const totalItems = filteredTransactions.length;
        setTotalPages(Math.ceil(totalItems / itemsPerPage));

        // Get current page items
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

        setTransactions(paginatedTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [activeTab, currentPage, itemsPerPage, startDate, endDate]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const toggleOptions = (id: string) => {
    if (showOptionsFor === id) {
      setShowOptionsFor(null);
    } else {
      setShowOptionsFor(id);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* All Transactions header with filters */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">All Transactions</h1>

        <div className="flex items-center gap-2">
          <span className="text-gray-600">Filter By</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.33334 7.33333H4.00001V8.66667H5.33334V7.33333ZM9.33334 7.33333H8.00001V8.66667H9.33334V7.33333ZM13.3333 7.33333H12V8.66667H13.3333V7.33333ZM14.6667 2H13.3333V0.666667H12V2H4.00001V0.666667H2.66667V2H1.33334C0.593335 2 0.00667191 2.6 0.00667191 3.33333L0 14.6667C0 15.4 0.593335 16 1.33334 16H14.6667C15.4 16 16 15.4 16 14.6667V3.33333C16 2.6 15.4 2 14.6667 2ZM14.6667 14.6667H1.33334V5.33333H14.6667V14.6667ZM5.33334 11.3333H4.00001V12.6667H5.33334V11.3333ZM9.33334 11.3333H8.00001V12.6667H9.33334V11.3333Z" fill="#6C7A89"/>
                </svg>
              </span>
            </div>
            <span>-</span>
            <div className="relative">
              <input
                type="text"
                placeholder="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.33334 7.33333H4.00001V8.66667H5.33334V7.33333ZM9.33334 7.33333H8.00001V8.66667H9.33334V7.33333ZM13.3333 7.33333H12V8.66667H13.3333V7.33333ZM14.6667 2H13.3333V0.666667H12V2H4.00001V0.666667H2.66667V2H1.33334C0.593335 2 0.00667191 2.6 0.00667191 3.33333L0 14.6667C0 15.4 0.593335 16 1.33334 16H14.6667C15.4 16 16 15.4 16 14.6667V3.33333C16 2.6 15.4 2 14.6667 2ZM14.6667 14.6667H1.33334V5.33333H14.6667V14.6667ZM5.33334 11.3333H4.00001V12.6667H5.33334V11.3333ZM9.33334 11.3333H8.00001V12.6667H9.33334V11.3333Z" fill="#6C7A89"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History header with View All */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transaction History</h2>
        <button
          className="text-sm text-gray-600 hover:text-gray-800"
          onClick={() => navigate('/admin/all-transactions')}
        >
          View All
        </button>
      </div>

      {/* Tabs with border around all */}
      <div className="mb-6">
        <div className="inline-flex border border-gray-200 rounded-md overflow-hidden">
          <button
            className={`px-4 py-2 ${
              activeTab === 'top-up'
                ? 'bg-[#C8EDDF80] text-green-800'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('top-up')}
          >
            Wallets Top-up
          </button>
          <button
            className={`px-4 py-2 border-l border-r border-gray-200 ${
              activeTab === 'salaries'
                ? 'bg-[#C8EDDF80] text-green-800'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('salaries')}
          >
            Salaries
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === 'withdrawals'
                ? 'bg-[#C8EDDF80] text-green-800'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('withdrawals')}
          >
            Withdrawals
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-700 bg-[#C8EDDF80]">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Transaction Type</th>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">{transaction.name}</td>
                    <td className="py-3 px-4">{transaction.type}</td>
                    <td className="py-3 px-4">{transaction.transactionId}</td>
                    <td className="py-3 px-4">{transaction.date}</td>
                    <td className="py-3 px-4">{transaction.amount}</td>
                    <td className="py-3 px-4">{transaction.description}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          transaction.status.toLowerCase() === 'successful'
                            ? 'bg-green-100 text-green-700'
                            : transaction.status.toLowerCase() === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 relative">
                      <button
                        onClick={() => toggleOptions(transaction.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <BsThreeDotsVertical />
                      </button>

                      {showOptionsFor === transaction.id && (
                        <div className="absolute right-8 top-10 bg-white shadow-lg rounded-md py-2 w-48 z-10">
                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            View Details
                          </div>
                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            Download Receipt
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 px-6 text-center text-gray-500"
                  >
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 0 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentPage === pageNum ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default Transactions;
