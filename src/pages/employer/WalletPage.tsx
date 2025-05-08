import React, { useState, useEffect } from 'react';
import { FaEye, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import WithdrawModal from '../../components/Employer/WithdrawModal';
import walletApi from '../../api/walletApi';
import { WalletTransaction } from '../../types/wallet';

const WalletPage: React.FC = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState<string>("0.00");
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  const handleOpenWithdrawModal = () => {
    setIsWithdrawModalOpen(true);
  };

  const handleCloseWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
  };

  useEffect(() => {
    // Fetch wallet balance
    const fetchWalletBalance = async () => {
      try {
        const response = await walletApi.getBalance();
        if (response.status && response.data) {
          setWalletBalance(response.data.current_balance);
        }
      } catch (err) {
        console.error("Error fetching wallet balance:", err);
      }
    };

    // Fetch wallet transactions
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await walletApi.getTransactions(currentPage, itemsPerPage);
        if (response.status && response.data && response.data.data) {
          setTransactions(response.data.data);
          setTotalPages(response.data.meta.last_page);
        }
      } catch (err: any) {
        console.error("Error fetching transactions:", err);
        setError(err.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchWalletBalance();
    fetchTransactions();
  }, [currentPage, itemsPerPage]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-[20px] font-semibold text-[#24292E] leading-[100%] tracking-[0%] align-middle mb-6">
        Wallet
      </h1>

      <div className="flex gap-4 mb-8 justify-center">
        {/* Balance Card */}
        <div className="bg-[#174B35] rounded-lg p-5 pt-8 text-white flex-1 max-w-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[180px] h-[180px] opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <line
                x1="40"
                y1="0"
                x2="90"
                y2="100"
                stroke="white"
                strokeWidth="1"
              />
              <line
                x1="45"
                y1="0"
                x2="95"
                y2="100"
                stroke="white"
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="0"
                x2="100"
                y2="100"
                stroke="white"
                strokeWidth="1"
              />
              <line
                x1="55"
                y1="0"
                x2="105"
                y2="100"
                stroke="white"
                strokeWidth="1"
              />
              <line
                x1="60"
                y1="0"
                x2="110"
                y2="100"
                stroke="white"
                strokeWidth="1"
              />
            </svg>
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm">Current Balance</span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-white"
              >
                <FaEye />
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-6">
              {showBalance ? `₦ ${parseFloat(walletBalance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '••••••••'}
            </h2>
            <div className="flex gap-2">
              <Link to="/employer/wallet/top-up">
                {' '}
                <button className="bg-white text-[#246D51] px-4 py-2 rounded-md flex items-center text-sm">
                  <FaPlus className="mr-2" /> Top-up
                </button>
              </Link>
              <button
                className="bg-white text-green-800 px-4 py-2 rounded-md flex items-center text-sm"
                onClick={handleOpenWithdrawModal}
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#E9E3E3] rounded-lg flex-1 max-w-md hidden md:block"></div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Transaction History</h2>
          <Link to="/employer/wallet-history">
            <button className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </button>{' '}
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="py-3 px-2 bg-[#C8EDDF80]">Transaction Type</th>
                  <th className="py-3 px-2 bg-[#C8EDDF80]">Transaction ID</th>
                  <th className="py-3 px-2 bg-[#C8EDDF80]">Status</th>
                  <th className="py-3 px-2 bg-[#C8EDDF80]">Amount</th>
                  <th className="py-3 px-2 bg-[#C8EDDF80]">Description</th>
                  <th className="py-3 px-2 bg-[#C8EDDF80]">Source</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-2 capitalize">{transaction.type}</td>
                      <td className="py-3 px-2">{transaction.transaction.reference_code.substring(0, 10)}...</td>
                      <td className="py-3 px-2">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          transaction.transaction.status === 'successful'
                            ? 'bg-green-100 text-green-700'
                            : transaction.transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {transaction.transaction.status.charAt(0).toUpperCase() + transaction.transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        ₦ {parseFloat(transaction.transaction.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </td>
                      <td className="py-3 px-2">{transaction.description}</td>
                      <td className="py-3 px-2">{transaction.source}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 px-6 text-center text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls can be added here if needed */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-3 py-1">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={handleCloseWithdrawModal}
      />
    </div>
  );
};

export default WalletPage;
