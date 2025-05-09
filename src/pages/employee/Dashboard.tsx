import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import userApi from '../../api/userApi';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    fetchUserProfile();
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
    <div className="p-6">
      <h1 className="text-[16px] font-normal text-[#24292E] mb-6">
        Hello {userProfile?.first_name || 'User'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#E7F6F0] p-6 rounded-lg h-[282px] relative">
          <div className="absolute top-6 right-6 w-[100px] h-[100px] bg-white rounded-full"></div>
          <div className="max-w-[65%] h-full flex flex-col justify-center">
            <h2 className="text-[16px] text-[#24292E] mb-2">Salary</h2>
            <p className="text-[24px] font-semibold text-[#24292E] mb-6">
              {userProfile?.salary ? formatCurrency(userProfile.salary) : '₦ 0.00'}
            </p>

            <div className="flex gap-20">
              <div>
                <p className="text-gray-600 text-sm mb-1">Account Details:</p>
                <p className="text-[#24292E] text-[14px]">Wema Bank</p>
                <p className="text-[#24292E] text-[14px]">1234567890</p>
              </div>

              <div>
                <p className="text-gray-600 text-sm mb-1">Payment Date:</p>
                <p className="text-[#24292E] text-[14px]">25th Nov, 2024</p>
                <p className="text-gray-600 text-[12px]">
                  Payment is automated
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#FFF1F1] p-6 rounded-lg h-[282px] relative">
          <div className="absolute top-6 right-6 w-[100px] h-[100px] bg-white rounded-full"></div>
          <div className="max-w-[65%] h-full flex flex-col justify-center">
            <h2 className="text-[16px] text-[#24292E] mb-2">Wallet Balance</h2>
            <p className="text-[24px] font-semibold text-[#24292E] mb-6">
              {userProfile?.wallet?.current_balance
                ? formatCurrency(userProfile.wallet.current_balance)
                : '₦ 0.00'}
            </p>

            <button className="flex items-center gap-2 bg-white text-[#24292E] py-3 px-4 rounded-lg text-[14px] w-fit">
              <FaPlus size={12} />
              Request for Salary Advance
            </button>
          </div>
        </div>

        <div className="bg-[#F1F0F9] p-6 rounded-lg h-[282px] relative">
          <div className="absolute top-6 right-6 w-[100px] h-[100px] bg-white rounded-full"></div>
          <div className="max-w-[65%] h-full flex flex-col justify-center">
            <h2 className="text-[16px] text-[#24292E] mb-2">
              Educational Resources
            </h2>
            <p className="text-[24px] font-semibold text-[#24292E]">None</p>
          </div>
        </div>

        <div className="bg-[#F1F1F1] p-6 rounded-lg h-[282px] relative">
          <div className="absolute top-6 right-6 w-[100px] h-[100px] bg-white rounded-full"></div>
          <div className="max-w-[65%] h-full flex flex-col justify-center">
            <h2 className="text-[16px] text-[#24292E] mb-2">Salary Advance</h2>
            <p className="text-[24px] font-semibold text-[#24292E] mb-6">₦ 0</p>

            <button className="flex items-center gap-2 bg-white text-[#24292E] py-3 px-4 rounded-lg text-[14px] w-fit">
              <FaPlus size={12} />
              Request for Salary Advance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
