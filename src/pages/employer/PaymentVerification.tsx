import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import walletApi from '../../api/walletApi';

const PaymentVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [verificationAttempted, setVerificationAttempted] = useState(false);
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    'verifying'
  );
  const [message, setMessage] = useState(
    'Please wait while we verify your payment...'
  );

  useEffect(() => {
    const verifyPayment = async () => {
      // Prevent duplicate verification attempts
      if (verificationAttempted) {
        return;
      }
      setVerificationAttempted(true);

      try {
        // Get reference from either trxref or reference parameter
        const reference =
          searchParams.get('trxref') || searchParams.get('reference');

        if (!reference) {
          throw new Error('No payment reference found');
        }

        console.log('Verifying payment with reference:', reference);

        // Make the verification request
        const response = await walletApi.verifyPayment(reference);

        console.log('Verification response:', response);

        // Handle the response
        if (response.status === 'success' || response.status === true) {
          if (response.data?.status === 'already_verified') {
            setStatus('success');
            setMessage(
              'Payment has already been verified successfully. Your wallet has been credited.'
            );
          } else {
            setStatus('success');
            setMessage('Payment successful! Your wallet has been credited.');
          }

          // Redirect to wallet page after 3 seconds
          setTimeout(() => {
            navigate('/employer/wallet?payment_success=true', {
              replace: true,
            });
          }, 3000);
        } else {
          throw new Error(response.message || 'Payment verification failed');
        }
      } catch (error: any) {
        console.error('Payment verification error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });

        setStatus('error');
        setMessage(
          error.response?.data?.message ||
            error.message ||
            'Could not verify payment. Please contact support if money was deducted.'
        );

        // Redirect to wallet page after 5 seconds
        setTimeout(() => {
          navigate('/employer/wallet', { replace: true });
        }, 5000);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, verificationAttempted]);

  const handleGoToWallet = () => {
    navigate('/employer/wallet?payment_success=true', { replace: true });
  };

  return (
    <div className="bg-white w-full h-full p-8">
      <div className="max-w-md mx-auto mt-20">
        <div className="text-center">
          <div className="mb-6">
            {status === 'verifying' && (
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
            )}
            {status === 'success' && (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {status === 'verifying' && 'Verifying Payment'}
            {status === 'success' && 'Payment Successful'}
            {status === 'error' && 'Verification Failed'}
          </h2>

          <p className="text-gray-600 mb-6">{message}</p>

          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-700 text-sm">
                Redirecting to your wallet in a few seconds...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">
                Redirecting to your wallet in a few seconds...
              </p>
            </div>
          )}

          {!verifying && (
            <button
              onClick={handleGoToWallet}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Go to Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentVerification;
