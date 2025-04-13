import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

interface Transaction {
  id: string;
  type: string;
  date: string;
  amount: number;
  description: string;
  from: string;
}

const WalletHistory: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample transactions data
  const transactions: Transaction[] = [
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'Wallet top-up',
      from: 'GT Bank',
    },
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'Wallet top-up',
      from: 'GT Bank',
    },
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'Wallet top-up',
      from: 'GT Bank',
    },
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'Wallet top-up',
      from: 'GT Bank',
    },
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'Wallet top-up',
      from: 'GT Bank',
    },
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'Wallet top-up',
      from: 'GT Bank',
    },
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'Wallet top-up',
      from: 'GT Bank',
    },
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'Wallet top-up',
      from: 'GT Bank',
    },
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'Wallet top-up',
      from: 'GT Bank',
    },
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'Wallet top-up',
      from: 'GT Bank',
    },
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'Wallet top-up',
      from: 'GT Bank',
    },
  ];

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white rounded-lg border-gray-200">
      <div className="flex items-center mb-1">
        <IoArrowBack
          className="text-gray-600 mr-2 cursor-pointer"
          size={20}
          onClick={handleBack}
        />
        <h1 className="text-[20px] font-semibold text-[#24292E]">See All</h1>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[16px] text-[#24292E] font-semibold mt-[1rem]">
          Transaction History
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="py-3 px-2 bg-[#C8EDDF80]">Transaction Type</th>
              <th className="py-3 px-2 bg-[#C8EDDF80]">Transaction ID</th>
              <th className="py-3 px-2 bg-[#C8EDDF80]">Date</th>
              <th className="py-3 px-2 bg-[#C8EDDF80]">Amount</th>
              <th className="py-3 px-2 bg-[#C8EDDF80]">Description</th>
              <th className="py-3 px-2 bg-[#C8EDDF80]">From</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((transaction, index) => (
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
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center gap-2 mt-4 pb-4 pr-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentPage === pageNum ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default WalletHistory;
