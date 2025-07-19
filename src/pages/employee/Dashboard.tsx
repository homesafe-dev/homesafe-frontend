import React, { useState, useEffect } from 'react';
import { FaPlus, FaEllipsisV, FaEye } from 'react-icons/fa';
import { BsBook } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import userApi from '../../api/userApi';
import walletApi from '../../api/walletApi';
import { WalletTransaction } from '../../types/wallet';

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  salary: string;
  wallet: {
    initial_balance: string;
    current_balance: string;
  };
  [key: string]: any;
}

const DashboardContent: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionsError, setTransactionsError] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userApi.getProfile();
        if (response.status) {
          setUserProfile(response.data);
        } else {
          setError('Failed to fetch user profile');
          console.error('Failed to fetch user profile:', response.message);
        }
      } catch (err) {
        setError('Error fetching user profile');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchTransactions = async () => {
      setTransactionsLoading(true);
      setTransactionsError(null);
      try {
        const response = await walletApi.getTransactions(1, 6);
        if (response.status && response.data && response.data.data) {
          setTransactions(response.data.data);
        }
      } catch (err: any) {
        console.error('Error fetching transactions:', err);
        setTransactionsError(err.message || 'Failed to load transactions');
      } finally {
        setTransactionsLoading(false);
      }
    };

    fetchUserProfile();
    fetchTransactions();
  }, []);

  // Format currency
  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(numAmount);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-[16px] font-normal text-[#24292E] mb-6">
        Hello {userProfile?.first_name || 'User'}
      </h1>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {/* Salary Card */}
        <div className="bg-[#174B35] text-white p-4 sm:p-6 rounded-lg shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] opacity-10">
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
          <div className="mb-4 sm:mb-6">
            <p className="text-white/80 text-sm mb-2">Monthly Salary</p>
            <h2 className="text-xl sm:text-2xl font-semibold">
              {userProfile?.salary
                ? formatCurrency(userProfile.salary)
                : '₦ 0.00'}
            </h2>
          </div>
          <div className="flex gap-4">
            <Link to="/employee/salary">
              <button className="bg-white text-[#246D51] h-[42px] py-2 px-3 sm:px-4 rounded flex items-center gap-2 text-sm">
                <FaEye size={12} />
                <span className="hidden sm:inline">View Details</span>
                <span className="sm:hidden">View</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-[#E7E3F6] p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="bg-[#C8EDDF80] p-3 sm:p-4 rounded-full flex-shrink-0">
              <FaPlus className="text-gray-500" size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[18px] sm:text-[20px] font-normal text-[#24292E] truncate">
                {userProfile?.wallet?.current_balance
                  ? formatCurrency(userProfile.wallet.current_balance)
                  : '₦ 0.00'}
              </h3>
              <p className="text-[#24292E] mt-2 text-[14px] sm:text-[16px]">Wallet Balance</p>
            </div>
          </div>
        </div>

        {/* Educational Resources Card */}
        <div className="bg-[#E9E3E3] p-4 sm:p-6 rounded-lg shadow sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="bg-[#EFAE7333] p-3 sm:p-4 rounded-full flex-shrink-0">
              <BsBook className="text-gray-500" size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[18px] sm:text-[20px] font-normal text-[#24292E]">0</h3>
              <p className="text-[#24292E] mt-2 text-[14px] sm:text-[16px]">
                Educational Resources
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card - Salary Advance */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-700 mb-4 sm:mb-6">Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-[#F1F1F1] p-4 sm:p-6 rounded-lg shadow min-h-[140px] sm:min-h-[180px] relative">
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] bg-white rounded-full"></div>
            <div className="mt-8 sm:mt-12">
              <p className="text-gray-600 text-sm">Available Advance</p>
              <h3 className="text-lg sm:text-xl font-medium text-gray-800 mt-2">₦ 0.00</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
          <h2 className="text-lg font-medium text-gray-700">
            Transaction History
          </h2>
          <Link to="/employee/salary">
            <button className="text-[#7B858E] text-sm hover:underline self-start sm:self-auto">
              View All
            </button>
          </Link>
        </div>

        {transactionsLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : transactionsError ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
            {transactionsError}
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-visible" style={{ marginLeft: '-1rem', marginRight: '-1rem' }}>
            <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
              <table className="w-full bg-green-50 rounded-lg overflow-hidden" style={{ minWidth: '800px' }}>
                <thead className="text-left text-gray-600 text-sm">
                  <tr>
                    <th className="py-4 px-6 font-medium whitespace-nowrap">Transaction ID</th>
                    <th className="py-4 px-6 font-medium whitespace-nowrap">Type</th>
                    <th className="py-4 px-6 font-medium whitespace-nowrap">Description</th>
                    <th className="py-4 px-6 font-medium whitespace-nowrap">Amount</th>
                    <th className="py-4 px-6 font-medium whitespace-nowrap">Status</th>
                    <th className="py-4 px-6 font-medium whitespace-nowrap"></th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-gray-100"
                      >
                        <td className="py-4 px-6 whitespace-nowrap">
                          {transaction.transaction.reference_code.substring(
                            0,
                            10
                          )}
                          ...
                        </td>
                        <td className="py-4 px-6 capitalize whitespace-nowrap">
                          {transaction.type}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">{transaction.description}</td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          ₦{' '}
                          {parseFloat(
                            transaction.transaction.amount
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${
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
                        <td className="py-4 px-6 whitespace-nowrap">
                          <button className="text-gray-500 hover:text-gray-700">
                            <FaEllipsisV size={16} />
                          </button>
                        </td>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
