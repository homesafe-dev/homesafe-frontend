import React from 'react';
import { FaPlus } from 'react-icons/fa';

const DashboardContent: React.FC = () => {
  return (
    <div className="p-6">
      {/* Greeting */}
      <h1 className="text-[16px] font-normal text-[#24292E] mb-6">
        Hello John
      </h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Salary Card */}
        <div className="bg-[#E7F6F0] p-6 rounded-lg h-[282px] relative">
          <div className="absolute top-6 right-6 w-[100px] h-[100px] bg-white rounded-full"></div>
          <div className="max-w-[65%] h-full flex flex-col justify-center">
            <h2 className="text-[16px] text-[#24292E] mb-2">Salary</h2>
            <p className="text-[24px] font-semibold text-[#24292E] mb-6">
              ₦ 100,000.00
            </p>

            <div className="flex gap-20">
              <div>
                <p className="text-gray-600 text-sm mb-1">Account Details:</p>
                <p className="text-[#24292E] text-[14px]">Wema Bank</p>
                <p className="text-[#24292E] text-[14px]">1234567890</p>
              </div>

              <div>
                <p className="text-gray-600 text-sm mb-1">Payment Date:</p>
                <p className="text-[#24292E] text-[14px]">25th Nov, 2024</p>
                <p className="text-gray-600 text-[12px]">
                  Payment is automated
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* First Salary Advance Card */}
        <div className="bg-[#FFF1F1] p-6 rounded-lg h-[282px] relative">
          <div className="absolute top-6 right-6 w-[100px] h-[100px] bg-white rounded-full"></div>
          <div className="max-w-[65%] h-full flex flex-col justify-center">
            <h2 className="text-[16px] text-[#24292E] mb-2">Salary Advance</h2>
            <p className="text-[24px] font-semibold text-[#24292E] mb-6">₦ 0</p>

            <button className="flex items-center gap-2 bg-white text-[#24292E] py-3 px-4 rounded-lg text-[14px] w-fit">
              <FaPlus size={12} />
              Request for Salary Advance
            </button>
          </div>
        </div>

        {/* Educational Resources Card */}
        <div className="bg-[#F1F0F9] p-6 rounded-lg h-[282px] relative">
          <div className="absolute top-6 right-6 w-[100px] h-[100px] bg-white rounded-full"></div>
          <div className="max-w-[65%] h-full flex flex-col justify-center">
            <h2 className="text-[16px] text-[#24292E] mb-2">
              Educational Resources
            </h2>
            <p className="text-[24px] font-semibold text-[#24292E]">None</p>
          </div>
        </div>

        {/* Second Salary Advance Card */}
        <div className="bg-[#F1F1F1] p-6 rounded-lg h-[282px] relative">
          <div className="absolute top-6 right-6 w-[100px] h-[100px] bg-white rounded-full"></div>
          <div className="max-w-[65%] h-full flex flex-col justify-center">
            <h2 className="text-[16px] text-[#24292E] mb-2">Salary Advance</h2>
            <p className="text-[24px] font-semibold text-[#24292E] mb-6">₦ 0</p>

            <button className="flex items-center gap-2 bg-white text-[#24292E] py-3 px-4 rounded-lg text-[14px] w-fit">
              <FaPlus size={12} />
              Request for Salary Advance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
