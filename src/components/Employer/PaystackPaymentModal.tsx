import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import walletApi from '../../api/walletApi';
import { getWalletBasePath, walletRoutes } from '../../utils/walletPaths';
import Toast from '../common/Toast';

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
  const { pathname } = useLocation();
  const basePath = getWalletBasePath(pathname);
  const routes = walletRoutes(basePath);
  const [toast, setToast] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
    isVisible: false,
  });

  // Toast helper functions
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };
  console.log('User:', user);

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      const errorMessage = 'Please enter a valid amount';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get the current domain for callback URL
      const currentDomain = window.location.origin;
      const callbackUrl = `${currentDomain}${routes.paymentVerify}`;

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
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to initialize payment. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
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
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md relative z-10 max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-gray-200">
              Top Up Wallet
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
              disabled={loading}
            >
              <FiX size={18} />
            </button>
          </div>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount (NGN)
              </label>
              <input
                type="text"
                placeholder="Enter amount"
                className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                value={amount}
                onChange={handleAmountChange}
                disabled={loading}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
              <p className="text-blue-600 text-xs sm:text-sm">
                You will be redirected to Paystack to complete your payment
                securely.
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
            <button
              onClick={handlePayment}
              disabled={loading || !amount || parseFloat(amount) <= 0}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Pay with Paystack'
              )}
            </button>

            <button
              onClick={onClose}
              disabled={loading}
              className="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 dark:text-gray-300 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default PaystackPaymentModal;
