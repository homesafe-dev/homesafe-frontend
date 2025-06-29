import React, { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { FaCreditCard } from 'react-icons/fa';
import PaystackPaymentModal from '../../components/Employer/PaystackPaymentModal';

const WalletTopUp: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white w-full h-full p-8">
      <div className="flex items-center mb-8">
        <IoIosArrowBack className="text-gray-600 mr-2" />
        <h2 className="text-gray-800 font-medium">Wallet Top Up</h2>
      </div>

      <div className="mb-8">
        <p className="text-gray-600 text-sm">
          Top up your wallet securely with Paystack
        </p>
      </div>

      <div className="space-y-4 w-[470px]">
        <div
          className="flex items-center justify-between border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 hover:border-green-300 transition-colors"
          onClick={handleOpenModal}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <FaCreditCard className="text-green-600" size={20} />
            </div>
            <div>
              <span className="text-gray-800 font-medium block">
                Pay with Paystack
              </span>
              <span className="text-gray-500 text-sm">
                Secure payment with cards, bank transfer & more
              </span>
            </div>
          </div>
          <div className="text-green-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 w-[470px]">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-blue-800 font-medium text-sm">
              Secure Payment
            </h4>
            <p className="text-blue-700 text-sm mt-1">
              Your payment is processed securely through Paystack. We support
              all major cards, bank transfers, and mobile money.
            </p>
          </div>
        </div>
      </div>

      <PaystackPaymentModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default WalletTopUp;
