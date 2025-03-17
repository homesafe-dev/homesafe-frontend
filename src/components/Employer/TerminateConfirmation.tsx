import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import Success from '../../assets/icons/success.svg'

interface TerminateContractConfirmationProps {
  isOpen: boolean;
  employeeName: string;
  terminationPeriod: string;
  onClose: () => void;
}

const TerminateContractConfirmation: React.FC<TerminateContractConfirmationProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="bg-white rounded-lg w-[520px] relative z-10 p-8">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <IoCloseOutline size={24} />
        </button>
        
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 mb-4 flex items-center justify-center">
            <img src={Success} alt='success'/>
          </div>
          
          <h2 className="text-2xl font-semibold text-center mb-4">
            Terminate Contract
          </h2>
          
          <p className="text-center text-gray-700 mb-8">
          Your contract with Cali foster an Employee, will be terminated in 1 week, 6 days.
          </p>
          
          <button
            onClick={onClose}
            className="w-full py-3 border border-green-400 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
          >
            Closed
          </button>
        </div>
      </div>
    </div>
  );
};

export default TerminateContractConfirmation;