import React, { useState } from 'react';
import { FaEye, FaPlus, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface Transaction {
  id: string;
  type: string;
  date: string;
  amount: number;
  description: string;
  from: string;
}

const WalletPage: React.FC = () => {
  const [showBalance, setShowBalance] = useState(true);
  
  // Sample transactions data
  const transactions: Transaction[] = [
    { id: '12345HY54345U76', type: 'Credit', date: '24th Dec 2024', amount: 50000, description: 'Wallet top-up', from: 'GT Bank' },
    { id: '12345HY54345U76', type: 'Credit', date: '24th Dec 2024', amount: 50000, description: 'Wallet top-up', from: 'GT Bank' },
    { id: '12345HY54345U76', type: 'Credit', date: '24th Dec 2024', amount: 50000, description: 'Wallet top-up', from: 'GT Bank' },
    { id: '12345HY54345U76', type: 'Credit', date: '24th Dec 2024', amount: 50000, description: 'Wallet top-up', from: 'GT Bank' },
    { id: '12345HY54345U76', type: 'Credit', date: '24th Dec 2024', amount: 50000, description: 'Wallet top-up', from: 'GT Bank' },
    { id: '12345HY54345U76', type: 'Credit', date: '24th Dec 2024', amount: 50000, description: 'Wallet top-up', from: 'GT Bank' },
    { id: '12345HY54345U76', type: 'Credit', date: '24th Dec 2024', amount: 50000, description: 'Wallet top-up', from: 'GT Bank' },
    { id: '12345HY54345U76', type: 'Credit', date: '24th Dec 2024', amount: 50000, description: 'Wallet top-up', from: 'GT Bank' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-[20px] font-semibold text-[#24292E] leading-[100%] tracking-[0%] align-middle mb-6">Wallet</h1>
      
      <div className="flex gap-4 mb-8 justify-center">
        {/* Balance Card */}
        <div className="bg-[#174B35] rounded-lg p-5 pt-8 text-white flex-1 max-w-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[180px] h-[180px] opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <line x1="40" y1="0" x2="90" y2="100" stroke="white" strokeWidth="1" />
              <line x1="45" y1="0" x2="95" y2="100" stroke="white" strokeWidth="1" />
              <line x1="50" y1="0" x2="100" y2="100" stroke="white" strokeWidth="1" />
              <line x1="55" y1="0" x2="105" y2="100" stroke="white" strokeWidth="1" />
              <line x1="60" y1="0" x2="110" y2="100" stroke="white" strokeWidth="1" />
            </svg>
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm">Current Balance</span>
              <button onClick={() => setShowBalance(!showBalance)} className="text-white">
                <FaEye />
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-6">
              {showBalance ? '₦ 100,000.00' : '••••••••'}
            </h2>
            <div className="flex gap-2">
             <Link to='/employer/wallet/top-up'> <button className="bg-white text-[#246D51] px-4 py-2 rounded-md flex items-center text-sm">
                <FaPlus className="mr-2" /> Top-up
              </button></Link>
              <button className="bg-white text-green-800 px-4 py-2 rounded-md flex items-center text-sm">
                Withdraw
              </button>
            </div>
          </div>
        </div>
        
        {/* Empty placeholder for potential second card */}
        <div className="bg-[#E9E3E3] rounded-lg flex-1 max-w-md hidden md:block"></div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Transaction History</h2>
          <Link to="/employer/wallet-history"><button className="text-sm text-blue-600 hover:text-blue-800">View All</button> </Link>
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
              {transactions.map((transaction, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-2">{transaction.type}</td>
                  <td className="py-3 px-2">{transaction.id}</td>
                  <td className="py-3 px-2">{transaction.date}</td>
                  <td className="py-3 px-2">₦ {transaction.amount.toLocaleString()}</td>
                  <td className="py-3 px-2">{transaction.description}</td>
                  <td className="py-3 px-2">{transaction.from}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;