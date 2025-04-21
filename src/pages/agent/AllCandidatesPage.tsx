import React from 'react';
import { FaUser } from 'react-icons/fa';

const AllCandidatesPage = () => {
  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[24px] text-[#24292E] font-semibold">Candidates</h1>
        <button className="bg-[#A5EA91] text-[#174B35] px-4 py-2 rounded-[8px] flex items-center gap-2">
          <span>+</span>
          Add New Candidate
        </button>
      </div>

      {/* Subheader */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-[#24292E] text-[16px]">
          Here are all your candidates
        </p>
        <button className="text-[#24292E] text-[16px]">View All</button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#C8EDDF80] h-[56px] text-left">
            <tr>
              <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
                New Candidate
              </th>
              <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
                Date
              </th>
              <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
                Placement
              </th>
              <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
                Gender
              </th>
              <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
                Phone Number
              </th>
              <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[...Array(8)].map((_, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-2 text-[13px] text-[#24292E] font-normal">
                  <div className="flex items-center gap-2 relative">
                    <div className="bg-[#BDBDBD] rounded-full p-2 flex items-center justify-center relative">
                      <FaUser className="text-white" />
                      <div className="absolute w-3 h-3 bg-green-500 rounded-full -top-1 -right-1 border-2 border-white" />
                    </div>
                  </div>
                  Naomi Abiodun John
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  24th Dec 2024
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  Mr Akunyili, Lagos
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  Female
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  07012345678
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[13px] ${
                      index === 1
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {index === 1 ? 'Unverified' : 'Verified'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-2 mt-4">
        <button className="p-2 rounded-full w-[40px] h-[40px] hover:bg-gray-100">
          &lt;
        </button>
        <button className="p-2 rounded-full w-[40px] h-[40px]  bg-gray-200">
          1
        </button>
        <button className="p-2 rounded-full w-[40px] h-[40px]  hover:bg-gray-100">
          2
        </button>
        <button className="p-2 rounded-full w-[40px] h-[40px]  hover:bg-gray-100">
          3
        </button>
        <button className="p-2 rounded-full w-[40px] h-[40px]  hover:bg-gray-100">
          &gt;
        </button>
      </div>
    </div>
  );
};

export default AllCandidatesPage;
