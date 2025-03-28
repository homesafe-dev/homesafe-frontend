import React, { useState } from 'react';
import { FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import CreatePayrollModal from '../../components/Employer/CreatePayrollModal';

interface PayrollEntry {
  name: string;
  position: string;
  amount: string;
  paymentDate: string;
  advancedSalary: string;
  status: string;
}

const PayrollPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const payrollEntries: PayrollEntry[] = Array(11).fill({
    name: 'Cali Foster Jenkins',
    position: 'Chef/housekeeper/Driver',
    amount: 'N 50,000',
    paymentDate: '25th Nov, 2024',
    advancedSalary: '-',
    status: 'Active',
  });

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[20px] font-semibold text-[#24292E]">Payroll</h1>
        <button
          className="bg-[#A5EA91] text-[#24292E] font-semibold w-[211px] h-[38px] px-4 py-2 rounded-md text-[13px] flex items-center gap-2"
          onClick={handleOpenCreateModal}
        >
          <FaPlus size={12} />
          <span>Add New Staff to Payroll</span>
        </button>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-[#24292E]">
            Payroll History
          </h2>
          <Link to="/employer/payroll/all">
            {' '}
            <button className="text-[#24292E] fonnt-semibold text-[13px]">
              View All
            </button>
          </Link>
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
      <CreatePayrollModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />
    </div>
  );
};

export default PayrollPage;
