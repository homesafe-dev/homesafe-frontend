import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import EmployersTab from './tabs/EmployersTab';
import AgentsTab from './tabs/AgentsTab';
import IncomingRequestsTab from './tabs/IncomingRequestsTab';

export default function AllUsersPage() {
  const [activeTab, setActiveTab] = useState('employers');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // This would typically come from your API

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="p-0">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-[#24292E] text-[18px] sm:text-[20px] font-semibold">Users</h2>
        <p className="text-gray-600 text-sm mt-1">
          Manage all users in the system
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white shadow rounded-lg">
        {/* Tabs */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 mb-4">
          <div className="flex flex-wrap gap-2 sm:space-x-4 sm:gap-0">
            <button
              className={`py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded ${
                activeTab === 'employers'
                  ? 'bg-[#C8EDDF80] text-[#174B35]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('employers')}
            >
              Employers
            </button>
            <button
              className={`py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded ${
                activeTab === 'agents'
                  ? 'bg-[#C8EDDF80] text-[#174B35]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('agents')}
            >
              Agents
            </button>
            <button
              className={`py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded ${
                activeTab === 'incoming'
                  ? 'bg-[#C8EDDF80] text-[#174B35]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('incoming')}
            >
              Incoming Request
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          {activeTab === 'employers' && <EmployersTab />}
          {activeTab === 'agents' && <AgentsTab />}
          {activeTab === 'incoming' && <IncomingRequestsTab />}
        </div>

        {/* Pagination */}
        <div className="flex justify-center sm:justify-end items-center p-3 sm:p-4">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`p-1.5 sm:p-2 rounded-full ${
                currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiChevronLeft size={16} className="sm:w-5 sm:h-5" />
            </button>

            {[...Array(3)].map((_, index) => {
              return (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-sm ${
                    currentPage === index + 1
                      ? 'bg-gray-200 text-gray-800 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}

            <button
              onClick={handleNextPage}
              disabled={currentPage === 3}
              className={`p-1.5 sm:p-2 rounded-full ${
                currentPage === totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiChevronRight size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
