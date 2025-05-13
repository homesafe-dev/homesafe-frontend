import React, { useState } from 'react';
import { FiX, FiChevronDown, FiChevronRight } from 'react-icons/fi';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'debit' | 'transfer'>(
    'debit'
  );
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [paymentMade, setPaymentMade] = useState(false);

  if (!isOpen) return null;

  const handlePayment = () => {
    if (selectedMethod === 'transfer') {
      setPaymentMade(true);
    } else {
    
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="bg-white rounded-lg w-full max-w-md relative z-10">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium text-gray-800">
              Payment Method
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Debit Card Accordion */}
          <div className="mb-4 border-b pb-4">
            <button
              className="w-full flex items-center justify-between py-2"
              onClick={() => setSelectedMethod('debit')}
            >
              <div className="flex items-center">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedMethod === 'debit' ? 'border-2 border-gray-500' : 'border-gray-300'}`}
                >
                  {selectedMethod === 'debit' && (
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  )}
                </div>
                <span className="ml-3 text-lg">Debit Card</span>
              </div>
              {selectedMethod === 'debit' ? (
                <FiChevronDown size={20} />
              ) : (
                <FiChevronRight size={20} />
              )}
            </button>

            {selectedMethod === 'debit' && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="**** **** **** ****"
                    className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Holder
                  </label>
                  <input
                    type="text"
                    placeholder="Card holder's name"
                    className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-gray-400"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Security Code
                    </label>
                    <input
                      type="text"
                      placeholder="CVV"
                      className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-gray-400"
                      value={securityCode}
                      onChange={(e) => setSecurityCode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="saveCard"
                    checked={saveCard}
                    onChange={() => setSaveCard(!saveCard)}
                    className="h-4 w-4 text-green-500 focus:ring-green-400 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="saveCard"
                    className="ml-2 text-sm text-gray-600"
                  >
                    Save card for future use?
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Transfer Accordion */}
          <div className="mb-6">
            <button
              className="w-full flex items-center justify-between py-2"
              onClick={() => setSelectedMethod('transfer')}
            >
              <div className="flex items-center">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedMethod === 'transfer' ? 'border-2 border-gray-500' : 'border-gray-300'}`}
                >
                  {selectedMethod === 'transfer' && (
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  )}
                </div>
                <span className="ml-3 text-lg">Transfer</span>
              </div>
              {selectedMethod === 'transfer' ? (
                <FiChevronDown size={20} />
              ) : (
                <FiChevronRight size={20} />
              )}
            </button>

            {selectedMethod === 'transfer' && !paymentMade && (
              <div className="mt-4">
                <div className="bg-green-50 rounded-lg p-4 text-center mb-4">
                  <div className="text-xl font-medium">1234567890</div>
                  <div className="text-sm text-gray-600">Wema Bank</div>
                </div>
              </div>
            )}

            {selectedMethod === 'transfer' && paymentMade && (
              <div className="mt-4">
                <div className="bg-green-50 rounded-lg p-4 text-center mb-4">
                  <div className="text-xl font-medium">1234567890</div>
                  <div className="text-sm text-gray-600">Wema Bank</div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-green-400 hover:bg-green-500 text-center py-4 rounded-md text-gray-800 font-medium"
          >
            {selectedMethod === 'debit'
              ? 'Make Payment'
              : paymentMade
                ? 'I have made payment'
                : 'I have made payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodModal;
