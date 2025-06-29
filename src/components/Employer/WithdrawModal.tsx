import React, { useState } from 'react';
import { FiX, FiChevronDown } from 'react-icons/fi';
import walletApi from '../../api/walletApi';
import { getBankNames, getBankCode } from '../../utils/banks';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const banks = getBankNames();

  if (!isOpen) return null;

  const resetForm = () => {
    setBankName('');
    setAccountNumber('');
    setAccountName('');
    setAmount('');
    setError(null);
    setSuccess(null);
    setIsDropdownOpen(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleWithdraw = async () => {
    setError(null);
    setSuccess(null);

    // Validation
    if (!bankName) {
      setError('Please select a bank');
      return;
    }
    if (!accountNumber) {
      setError('Please enter account number');
      return;
    }
    if (!accountName) {
      setError('Please enter account holder name');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const bankCode = getBankCode(bankName);
    if (!bankCode) {
      setError('Invalid bank selected');
      return;
    }

    try {
      setIsLoading(true);
      const response = await walletApi.initializeWithdrawal(
        parseFloat(amount),
        bankCode,
        accountNumber,
        accountName
      );

      if (response.status) {
        setSuccess('Withdrawal initiated successfully!');
        setTimeout(() => {
          handleClose();
          onSuccess?.();
        }, 2000);
      } else {
        setError(response.message || 'Withdrawal failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during withdrawal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="bg-white rounded-lg w-full max-w-md relative z-10">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-medium text-gray-800">Withdraw</h2>
            <button
              onClick={handleClose}
              className="rounded-full p-1 hover:bg-gray-100"
              disabled={isLoading}
            >
              <FiX size={20} />
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            Provide an account details for withdrawal
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
              {success}
            </div>
          )}

          {/* Bank Name Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full text-left bg-white border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-gray-400 flex justify-between items-center disabled:opacity-50"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={isLoading}
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
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-50"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Holder Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-50"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleWithdraw}
            disabled={isLoading || !!success}
            className="w-full bg-green-400 hover:bg-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-center py-4 rounded-md text-gray-800 font-medium transition-colors"
          >
            {isLoading ? 'Processing...' : success ? 'Success!' : 'Withdraw'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
