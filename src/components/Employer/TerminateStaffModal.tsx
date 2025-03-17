import React, { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

interface NoticeOfTerminationProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (noticePeriod: string) => void;
}

const TerminateStaffModal: React.FC<NoticeOfTerminationProps> = ({ isOpen, onClose, onSubmit }) => {
  const [noticePeriod, setNoticePeriod] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (noticePeriod) {
      onSubmit(noticePeriod);
    }
  };

  const handleSelectPeriod = (period: string) => {
    setNoticePeriod(period);
    setIsDropdownOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="bg-white rounded-lg w-[520px] relative z-10">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Notice of Termination</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoCloseOutline size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-2">
                Notice Period
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 border border-gray-300 rounded-md flex justify-between items-center"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {noticePeriod || 'Select a notice period'}
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <div 
                      className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectPeriod('Two (2) Weeks Notice')}
                    >
                      Two (2) Weeks Notice
                    </div>
                    <div 
                      className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectPeriod('Three (3) Weeks Notice')}
                    >
                      Three (3) Weeks Notice
                    </div>
                    <div 
                      className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectPeriod('Four (4) Weeks Notice')}
                    >
                      Four (4) Weeks Notice
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm text-gray-700 mb-2">
                Why do you want to leave?
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tell us why you're leaving"
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-green-300 text-gray-800 rounded-md hover:bg-green-400 transition duration-200"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TerminateStaffModal;