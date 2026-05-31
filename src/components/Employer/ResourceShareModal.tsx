import React, { useState } from 'react';
import { IoClose, IoAdd } from 'react-icons/io5';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [staffName, setStaffName] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md relative z-10">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[25px] font-semibold text-gray-900 dark:text-gray-100">
              Share
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <IoClose size={20} />
            </button>
          </div>

          <div className="mb-5">
            <label className="block text-[13px] font-medium text-gray-900 dark:text-gray-100 mb-2 mt-2">
              Staff Name
            </label>
            <input
              type="text"
              placeholder="Share this link with"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <button className="w-full bg-[#A5EA91] hover:bg-green-500 text-center py-4 rounded-md text-gray-800 dark:text-gray-200 font-medium mb-4">
            Share Link
          </button>

          <button className="w-full border border-gray-300 hover:bg-elevated/50 rounded-md py-4 font-medium flex items-center justify-center">
            <IoAdd size={18} className="mr-2" />
            Add Staff
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
