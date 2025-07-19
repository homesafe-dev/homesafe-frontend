import React, { useState, useEffect } from 'react';
import { FaEye, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import WithdrawModal from '../../components/Employer/WithdrawModal';
import walletApi from '../../api/walletApi';
import { WalletTransaction } from '../../types/wallet';

const WalletPage: React.FC = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState<string>('0.00');
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

  // Function to refresh wallet data
  const refreshWalletData = async () => {
    try {
      const response = await walletApi.getBalance();
      if (response.status && response.data) {
        setWalletBalance(response.data.current_balance);
      }
    } catch (err) {
      console.error('Error fetching wallet balance:', err);
    }
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
        console.error('Error fetching wallet balance:', err);
      }
    };

    // Fetch wallet transactions
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await walletApi.getTransactions(
          currentPage,
          itemsPerPage
        );
        if (response.status && response.data && response.data.data) {
          setTransactions(response.data.data);
          setTotalPages(response.data.meta.last_page);
        }
      } catch (err: any) {
        console.error('Error fetching transactions:', err);
        setError(err.message || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletBalance();
    fetchTransactions();

    // Check if we're returning from a payment
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_success') === 'true') {
      // Refresh wallet data after successful payment
      setTimeout(() => {
        refreshWalletData();
      }, 1000);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [currentPage, itemsPerPage]);

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-6xl mx-auto">
      <h1 className="text-[18px] sm:text-[20px] font-semibold text-[#24292E] leading-[100%] tracking-[0%] align-middle mb-4 sm:mb-6">
        Wallet
      </h1>

      <div className="flex flex-col lg:flex-row gap-4 mb-6 sm:mb-8 justify-center">
        {/* Balance Card */}
        <div className="bg-[#174B35] rounded-lg p-4 sm:p-5 pt-6 sm:pt-8 text-white flex-1 max-w-md relative overflow-hidden">
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
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm">Current Balance</span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-white p-1"
              >
                <FaEye size={16} />
              </button>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              {showBalance
                ? `₦ ${parseFloat(walletBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : '••••••••'}
            </h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link to="/employer/wallet/top-up" className="flex-1 sm:flex-none">
                <button className="w-full sm:w-auto bg-white text-[#246D51] px-3 sm:px-4 py-2 rounded-md flex items-center justify-center text-xs sm:text-sm">
                  <FaPlus className="mr-2" size={12} /> Top-up
                </button>
              </Link>
              <button
                className="w-full sm:w-auto bg-white text-green-800 px-3 sm:px-4 py-2 rounded-md flex items-center justify-center text-xs sm:text-sm"
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <h2 className="text-base sm:text-lg font-medium">Transaction History</h2>
          <Link to="/employer/wallet-history">
            <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 self-start sm:self-auto">
              View All
            </button>
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
            <table className="w-full text-xs sm:text-sm min-w-[600px]">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="py-2 sm:py-3 px-2 bg-[#C8EDDF80] text-xs sm:text-sm">Transaction Type</th>
                  <th className="py-2 sm:py-3 px-2 bg-[#C8EDDF80] text-xs sm:text-sm">Transaction ID</th>
                  <th className="py-2 sm:py-3 px-2 bg-[#C8EDDF80] text-xs sm:text-sm">Status</th>
                  <th className="py-2 sm:py-3 px-2 bg-[#C8EDDF80] text-xs sm:text-sm">Amount</th>
                  <th className="py-2 sm:py-3 px-2 bg-[#C8EDDF80] text-xs sm:text-sm">Description</th>
                  <th className="py-2 sm:py-3 px-2 bg-[#C8EDDF80] text-xs sm:text-sm">Source</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-2 sm:py-3 px-2 capitalize text-xs sm:text-sm">
                        {transaction.type}
                      </td>
                      <td className="py-2 sm:py-3 px-2 text-xs sm:text-sm">
                        {transaction.transaction.reference_code.substring(
                          0,
                          10
                        )}
                        ...
                      </td>
                      <td className="py-2 sm:py-3 px-2">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs ${
                            transaction.transaction.status === 'successful'
                              ? 'bg-green-100 text-green-700'
                              : transaction.transaction.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {transaction.transaction.status
                            .charAt(0)
                            .toUpperCase() +
                            transaction.transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-2 text-xs sm:text-sm">
                        ₦{' '}
                        {parseFloat(
                          transaction.transaction.amount
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-2 sm:py-3 px-2 text-xs sm:text-sm">{transaction.description}</td>
                      <td className="py-2 sm:py-3 px-2 text-xs sm:text-sm">{transaction.source}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
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

        {/* Pagination controls can be added here if needed */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <div className="flex space-x-1 sm:space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
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
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
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
        onSuccess={refreshWalletData}
      />
    </div>
  );
};

export default WalletPage;
