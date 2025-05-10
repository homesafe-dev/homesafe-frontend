import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AgentSecurityPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-[85%]">
      <div className="mb-8">
        <button
          className="flex items-center text-gray-600 hover:text-gray-800"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" />
          <span className="text-gray-800">Security</span>
        </button>
      </div>

      <div className="mt-8 border border-[#E7E9EF] rounded-[4px] p-6">
        <h2 className="text-base font-medium text-gray-700 mb-1">
          Change Password
        </h2>
        <p className="text-sm text-[#81899E] mb-4 w-[286px] mt-[0.5rem]">
          The new password will be used to log into your agent account
        </p>

        <button className="px-4 py-2 text-[#174B35] border border-[#A5EA91] mt-[0.5rem] rounded-md text-sm hover:bg-gray-50">
          Change Password
        </button>
      </div>
    </div>
  );
};

export default AgentSecurityPage;
