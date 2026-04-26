import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import walletApi from '../../api/walletApi';
import { WalletTransaction } from '../../types/wallet';

const WalletHistory: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
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

    fetchTransactions();
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6">
      <div className="flex items-center mb-1">
        <IoArrowBack
          className="text-gray-600 dark:text-gray-400 dark:text-gray-300 mr-2 cursor-pointer"
          size={18}
          onClick={handleBack}
        />
        <h1 className="text-[18px] sm:text-[20px] font-semibold text-gray-900 dark:text-gray-100">
          See All
        </h1>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[14px] sm:text-[16px] text-gray-900 dark:text-gray-100 font-semibold mt-[1rem]">
          Transaction History
        </h2>
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
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 sm:py-3 px-2 bg-[#C8EDDF80] text-xs sm:text-sm">
                  Transaction Type
                </th>
                <th className="py-2 sm:py-3 px-2 bg-[#C8EDDF80] text-xs sm:text-sm">
                  Transaction ID
                </th>
                <th className="py-2 sm:py-3 px-2 bg-[#C8EDDF80] text-xs sm:text-sm">
                  Status
                </th>
                <th className="py-2 sm:py-3 px-2 bg-[#C8EDDF80] text-xs sm:text-sm">
                  Amount
                </th>
                <th className="py-2 sm:py-3 px-2 bg-[#C8EDDF80] text-xs sm:text-sm">
                  Description
                </th>
                <th className="py-2 sm:py-3 px-2 bg-[#C8EDDF80] text-xs sm:text-sm">
                  Source
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-2 sm:py-3 px-2 capitalize text-xs sm:text-sm">
                      {transaction.type}
                    </td>
                    <td className="py-2 sm:py-3 px-2 text-xs sm:text-sm">
                      {transaction.transaction.reference_code.substring(0, 10)}
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
                    <td className="py-2 sm:py-3 px-2 text-xs sm:text-sm">
                      {transaction.description}
                    </td>
                    <td className="py-2 sm:py-3 px-2 text-xs sm:text-sm">
                      {transaction.source}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 px-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && totalPages > 0 && (
        <div className="flex justify-center sm:justify-end items-center gap-1 sm:gap-2 mt-4 pb-4 pr-0 sm:pr-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 sm:p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 text-sm"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${
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

export default WalletHistory;
