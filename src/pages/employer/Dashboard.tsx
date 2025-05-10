import React, { useState, useEffect } from 'react';
import { FaEye, FaPlus, FaEllipsisV } from 'react-icons/fa';
import { BsCreditCard, BsPeople } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import walletApi from '../../api/walletApi';
import userApi from '../../api/userApi';
import { WalletTransaction } from '../../types/wallet';

const DashboardContent: React.FC = () => {
  const [walletBalance, setWalletBalance] = useState<string>("0.00");
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("User");

  useEffect(() => {
    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const response = await userApi.getProfile();
        if (response.status) {
          const userData = response.data;
          setUserName(userData.first_name || "User");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();


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
        const response = await walletApi.getTransactions(1, 6);
        if (response.status && response.data && response.data.data) {
          setTransactions(response.data.data);
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
  }, []);

  return (
    <div className="bg-white min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[16px] font-normal text-[#24292E]">Hello {userName}</h1>
        <div className="bg-[#EFAE73] text-[#24292E] h-[42px] w-[165px] flex justify-center items-center px-4 py-1 rounded-full text-sm">
          Ruby Subscription
        </div>
      </div>

      {/* Balance and Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Balance Card */}
        <div className="bg-[#174B35] text-white p-6 rounded-lg shadow relative overflow-hidden">
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
          <button className="absolute right-4 top-4 text-white/80 hover:text-white">
            <FaEye size={20} />
          </button>
          <div className="mb-6">
            <p className="text-white/80 text-sm mb-2">Current Balance</p>
            <h2 className="text-2xl font-semibold">₦ {parseFloat(walletBalance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
          </div>
          <div className="flex gap-4">
            <Link to="/employer/wallet/top-up">
              <button className="bg-white hover:bg-green-600 text-[#246D51] h-[42px] py-2 px-4 rounded flex items-center gap-2 text-sm">
                <FaPlus size={12} />
                Top-up
              </button>
            </Link>
            <Link to="/employer/wallet">
              <button className="bg-white text-green-800 h-[42px] py-2 px-4 rounded flex items-center gap-2 text-sm">
                <BsCreditCard size={12} />
                Withdraw
              </button>
            </Link>
          </div>
        </div>

        {/* Staff Count Cards */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <div className="flex items-center gap-6">
            <div className="bg-[#C8EDDF80] p-4 rounded-full">
              <BsPeople className="text-gray-500" size={24} />
            </div>
            <div>
              <h3 className="text-[20px] font-normal text-[#24292E]">00</h3>
              <p className="text-[#24292E] mt-2 text-[16px]">
                Total Number of Staff
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <div className="flex items-center gap-6">
            <div className="bg-[#EFAE7333] p-4 rounded-full">
              <BsPeople className="text-gray-500" size={24} />
            </div>
            <div>
              <h3 className="text-[20px] font-normal text-[#24292E]">00</h3>
              <p className="text-[#24292E] mt-2 text-[16px]">
                Total Number of Staff
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-700 mb-6">Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Educational Resources Card */}
          <div className="bg-[#E7E3F6] p-6 rounded-lg shadow min-h-[282px]">
            <div className="flex justify-between">
              <div className="mt-12">
                <p className="text-gray-600 text-sm">
                  Staff on Educational Resources
                </p>
                <h3 className="text-xl font-medium text-gray-800 mt-2">None</h3>
                <button className="flex items-center gap-2 mt-6 bg-white border border-gray-300 text-gray-600 py-2 px-4 rounded-md text-sm">
                  <BsCreditCard size={12} />
                  Recommend Resources
                </button>
              </div>
              <div className="bg-white w-[100px] h-[100px] rounded-full"></div>
            </div>
          </div>

          {/* Staff Payroll Card */}
          <div className="bg-[#E9E3E3] p-6 rounded-lg shadow min-h-[282px]">
            <div className="flex justify-between">
              <div className="mt-12">
                <p className="text-gray-600 text-sm">Total Staff Payroll</p>
                <h3 className="text-xl font-medium text-gray-800 mt-2">
                  ₦ 1,200,000.00
                </h3>
                <button className="flex items-center gap-2 mt-6 bg-white border border-gray-300 text-gray-600 py-2 px-4 rounded-md text-sm">
                  <FaPlus size={12} />
                  Add Staff to Payroll
                </button>
              </div>
              <div className="bg-white w-[100px] h-[100px] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* History Section - Wallet Transactions */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-700">Transaction History</h2>
          <Link to="/employer/wallet-history">
            <button className="text-[#7B858E] text-sm hover:underline">
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
            <table className="min-w-full bg-green-50 rounded-lg overflow-hidden">
              <thead className="text-left text-gray-600 text-sm">
                <tr>
                  <th className="py-4 px-6 font-medium">Transaction ID</th>
                  <th className="py-4 px-6 font-medium">Type</th>
                  <th className="py-4 px-6 font-medium">Description</th>
                  <th className="py-4 px-6 font-medium">Amount</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                  <th className="py-4 px-6 font-medium"></th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100">
                      <td className="py-4 px-6">{transaction.transaction.reference_code.substring(0, 10)}...</td>
                      <td className="py-4 px-6 capitalize">{transaction.type}</td>
                      <td className="py-4 px-6">{transaction.description}</td>
                      <td className="py-4 px-6">₦ {parseFloat(transaction.transaction.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      <td className="py-4 px-6">
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
                      <td className="py-4 px-6">
                        <button className="text-gray-500 hover:text-gray-700">
                          <FaEllipsisV size={16} />
                        </button>
                      </td>
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
      </div>
    </div>
  );
};

export default DashboardContent;
