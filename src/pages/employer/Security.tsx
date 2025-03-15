import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const SecurityPage: React.FC = () => {
  return (
    <div className="w-[85%]">
      {/* Security header with back button */}
      <div className="mb-8">
        <button className="flex items-center text-gray-600 hover:text-gray-800">
          <FaArrowLeft className="mr-2" />
          <span className="text-gray-800">Security</span>
        </button>
      </div>

      {/* Change Password Section */}
      <div className="mt-8 border border-[#E7E9EF] rounded-[4px] p-6">
        <h2 className="text-base font-medium text-gray-700 mb-1">Change Password</h2>
        <p className="text-sm text-[#81899E] mb-4 w-[286px] mt-[0.5rem]">
          The new password will be used to log into your account
        </p>
        
        <button
          className="px-4 py-2 text-[#174B35] border border-[#A5EA91] mt-[0.5rem] rounded-md text-sm hover:bg-gray-50"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default SecurityPage;