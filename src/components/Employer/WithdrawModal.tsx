import React, { useState } from 'react';
import { FiX, FiChevronDown } from 'react-icons/fi';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [banks] = useState([
    'Access Bank',
    'GTBank',
    'First Bank',
    'UBA',
    'Zenith Bank',
    'Wema Bank',
    'Fidelity Bank',
    'Sterling Bank',
  ]);

  if (!isOpen) return null;

  const handleWithdraw = () => {
    //hanndle
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="bg-white rounded-lg w-full max-w-md relative z-10">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-medium text-gray-800">Withdraw</h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <FiX size={20} />
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            Provide an account details for withdrawal
          </p>

          {/* Bank Name Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full text-left bg-white border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-gray-400 flex justify-between items-center"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className={bankName ? 'text-gray-900' : 'text-gray-400'}>
                  {bankName || 'Select'}
                </span>
                <FiChevronDown size={16} className="text-gray-400" />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto border border-gray-200">
                  <ul className="py-1">
                    {banks.map((bank) => (
                      <li
                        key={bank}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                        onClick={() => {
                          setBankName(bank);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {bank}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              type="text"
              placeholder="0123456789"
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-gray-400"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="text"
              placeholder="00.00"
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-gray-400"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <button
            onClick={handleWithdraw}
            className="w-full bg-green-400 hover:bg-green-500 text-center py-4 rounded-md text-gray-800 font-medium"
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
