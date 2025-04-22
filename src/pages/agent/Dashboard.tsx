import { BsPeople } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';

export default function AgentDashboard() {
  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[16px] text-[#24292E]">Hello John</h1>
        <button className="bg-[#EFAE73] h-[42px] text-[16px] text-[#24292E] px-4 py-2 w-[165px] rounded-[59px]">
          Ruby Subscription
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6 h-[208px] flex items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center">
              <BsPeople className="text-gray-500" size={24} />
            </div>
            <div>
              <h2 className="text-[20px] text-[#24292E] font-normal">00</h2>
              <p className="text-[#24292E] text-[16px]">
                Total Number of Candidates
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 h-[208px] flex items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#E8E9F5] rounded-full flex items-center justify-center">
              <BsPeople className="text-gray-500" size={24} />
            </div>
            <div>
              <h2 className="text-[20px] text-[#24292E] font-normal">00</h2>
              <p className="text-[#24292E] text-[16px]">
                Candidates on Placement
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 h-[208px] flex items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F5E8E9] rounded-full flex items-center justify-center">
              <BsPeople className="text-gray-500" size={24} />
            </div>
            <div>
              <h2 className="text-[20px] text-[#24292E] font-normal">00</h2>
              <p className="text-[#24292E] text-[16px]">
                Candidates terminated
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <div className="">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-[#24292E] text-[20px] font-semibold">
            Activities
          </h2>
          <button className="text-[#7B858E] hover:text-gray-900 font-semibold text-[13px]">
            View All
          </button>
        </div>

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
      </div>
    </div>
  );
}
