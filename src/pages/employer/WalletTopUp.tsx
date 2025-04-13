import React, { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import PaymentMethodModal from '../../components/Employer/PaymentModal';

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
        <p className="text-gray-600 text-sm">Select a top-up method below</p>
      </div>

      <div className="space-y-4 w-[470px]">
        <div
          className="flex items-center justify-between border-b border-gray-100 pb-4 cursor-pointer hover:bg-gray-50"
          onClick={handleOpenModal}
        >
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center mr-3">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
            <span className="text-gray-700">Debit Card</span>
          </div>
          <IoIosArrowForward className="text-gray-400" />
        </div>

        <div
          className="flex items-center justify-between border-b border-gray-100 pb-4 cursor-pointer hover:bg-gray-50"
          onClick={handleOpenModal}
        >
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center mr-3">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
            <span className="text-gray-700">Transfer</span>
          </div>
          <IoIosArrowForward className="text-gray-400" />
        </div>
      </div>

      <PaymentMethodModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default WalletTopUp;
