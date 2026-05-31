import React, { useState } from 'react';
import { FaPlus, FaTimes, FaCalendarAlt, FaChevronDown } from 'react-icons/fa';

interface CreatePayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePayrollModal: React.FC<CreatePayrollModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [enableAutoPayment, setEnableAutoPayment] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 relative z-10">
        <div className="p-6">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              Create Payroll
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Form */}
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Staff
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter staff name"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaChevronDown className="text-gray-400" size={14} />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Staff name is searchable
              </p>
            </div>

            {/* Position */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Position
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Select"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
                  readOnly
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaChevronDown className="text-gray-400" size={14} />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount
              </label>
              <input
                type="text"
                placeholder="N 0"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date to Pay
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Select"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
                  readOnly
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FaCalendarAlt className="text-gray-400" size={16} />
                </div>
              </div>
            </div>

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="enableAutoPayment"
                checked={enableAutoPayment}
                onChange={() => setEnableAutoPayment(!enableAutoPayment)}
                className="h-4 w-4 text-green-500 border-gray-300 rounded focus:ring-0"
              />
              <label
                htmlFor="enableAutoPayment"
                className="ml-2 text-sm text-gray-500 dark:text-gray-400"
              >
                Enable automate payment
              </label>
            </div>

            <button
              type="button"
              className="w-full bg-[#A5EA91] text-gray-900 dark:text-gray-100 h-[50px] font-medium py-3 rounded-lg mb-3 hover:bg-green-400 transition-colors"
            >
              Create Payroll
            </button>

            <button
              type="button"
              className="w-full border border-gray-300 h-[50px] text-gray-700 dark:text-gray-300 font-medium py-3 rounded-lg flex items-center justify-center hover:bg-elevated/50 transition-colors"
            >
              <FaPlus size={12} className="mr-2" />
              Add Staff
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePayrollModal;
