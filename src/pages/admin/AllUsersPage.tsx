import { useState } from 'react';
import EmployersTab from './tabs/EmployersTab';
import AgentsTab from './tabs/AgentsTab';
import IncomingRequestsTab from './tabs/IncomingRequestsTab';

export default function AllUsersPage() {
  const [activeTab, setActiveTab] = useState('employers');

  return (
    <div className="p-0">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Users Management
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Manage and monitor all users in the system
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        {/* Tabs */}
        <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex flex-wrap gap-2 sm:gap-0 sm:space-x-1">
            <button
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'employers'
                  ? 'bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/40'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('employers')}
            >
              Employers
            </button>
            <button
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'agents'
                  ? 'bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/40'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('agents')}
            >
              Agents
            </button>
            <button
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'incoming'
                  ? 'bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/40'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('incoming')}
            >
              Incoming Requests
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {activeTab === 'employers' && <EmployersTab />}
          {activeTab === 'agents' && <AgentsTab />}
          {activeTab === 'incoming' && <IncomingRequestsTab />}
        </div>
      </div>
    </div>
  );
}
