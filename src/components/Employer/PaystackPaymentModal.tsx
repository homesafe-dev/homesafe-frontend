import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import walletApi from '../../api/walletApi';

interface PaystackPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PaystackPaymentModal: React.FC<PaystackPaymentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  console.log('User:', user);

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get the current domain for callback URL
      const currentDomain = window.location.origin;
      const callbackUrl = `${currentDomain}/employer/wallet/payment/verify`;

      console.log('Initializing payment with:', {
        amount: parseFloat(amount),
        callback_url: callbackUrl,
      });

      const response = await walletApi.initializePayment(
        parseFloat(amount),
        callbackUrl
      );

      console.log('Payment initialization response:', response);

      if (response.status && response.data?.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = response.data.authorization_url;
      } else {
        throw new Error(response.message || 'Failed to initialize payment');
      }
    } catch (err: any) {
      console.error('Payment initialization error:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to initialize payment. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError(null);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg w-full max-w-md relative z-10">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium text-gray-800">
              Top Up Wallet
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
              disabled={loading}
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (NGN)
              </label>
              <input
                type="text"
                placeholder="Enter amount"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={amount}
                onChange={handleAmountChange}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-600 text-sm">
                You will be redirected to Paystack to complete your payment
                securely.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={handlePayment}
              disabled={loading || !amount || parseFloat(amount) <= 0}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Pay with Paystack'
              )}
            </button>

            <button
              onClick={onClose}
              disabled={loading}
              className="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaystackPaymentModal;
