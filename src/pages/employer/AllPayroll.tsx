import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

interface PayrollEntry {
  name: string;
  position: string;
  amount: string;
  paymentDate: string;
  advancedSalary: string;
  status: string;
}

const AllPayrollPage: React.FC = () => {
  const navigate = useNavigate();
  const payrollEntries: PayrollEntry[] = Array(11).fill({
    name: 'Cali Foster Jenkins',
    position: 'Chef/housekeeper/Driver',
    amount: 'N 50,000',
    paymentDate: '25th Nov, 2024',
    advancedSalary: '-',
    status: 'Active',
  });
  const handleBack = () => {
    navigate(-1); // Goes back one step in history
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex items-center mb-1">
        <IoArrowBack
          className="text-gray-600 mr-2 cursor-pointer"
          size={20}
          onClick={handleBack}
        />
        <h1 className="text-[20px] font-semibold text-[#24292E]">See All</h1>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2 mt-8">
          <h2 className="text-xl font-semibold text-[#24292E]">
            Payroll History
          </h2>
        </div>

        <div className="w-full mt-[1rem]">
          {/* Table Header */}
          <div className="grid grid-cols-6 bg-[#C8EDDF80] rounded-t-lg">
            <div className="p-3 text-sm font-medium text-gray-600">Staff</div>
            <div className="p-3 text-sm font-medium text-gray-600">
              Position
            </div>
            <div className="p-3 text-sm font-medium text-gray-600">Amount</div>
            <div className="p-3 text-sm font-medium text-gray-600">
              Payment Date
            </div>
            <div className="p-3 text-sm font-medium text-gray-600">
              Advance Salary
            </div>
            <div className="p-3 text-sm font-medium text-gray-600">Status</div>
          </div>

          {/* Table Body */}
          <div className="bg-white">
            {payrollEntries.map((entry, index) => (
              <div
                key={index}
                className="grid grid-cols-6 border-b border-[#DEE0E3]"
              >
                <div className="p-3 text-sm text-gray-800">{entry.name}</div>
                <div className="p-3 text-sm text-gray-800">
                  {entry.position}
                </div>
                <div className="p-3 text-sm text-gray-800">{entry.amount}</div>
                <div className="p-3 text-sm text-gray-800">
                  {entry.paymentDate}
                </div>
                <div className="p-3 text-sm text-gray-800">
                  {entry.advancedSalary}
                </div>
                <div className="p-3">
                  <span className="bg-[#C8EDDF80] text-green-800 px-3 py-1 rounded-md text-sm">
                    {entry.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-end items-center gap-4 mt-6">
            <button className="p-2">
              <FaChevronLeft size={14} className="text-gray-500" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#00000014] text-[#000000DE] font-medium">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md text-[#000000DE] ">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md text-[#000000DE] ">
              3
            </button>
            <button className="p-2">
              <FaChevronRight size={14} className="text-[#000000DE] " />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPayrollPage;
