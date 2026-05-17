import React, { useState, useEffect } from 'react';
import {
  Search,
  Download,
  FileText,
  Calendar,
  User,
  Briefcase,
  Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ContractImg from '../../assets/images/Contract.png';
import contractApi from '../../api/contractApi';
import { format } from 'date-fns';

interface ProposalDetails {
  start_date: string;
  employee_id: number;
  duration_months: number;
  working_days_per_month: number;
  working_hours_per_week: number;
  working_hours_schedule: string;
}

interface Proposal {
  id: number;
  employment_contract_id: number;
  proposed_by: number;
  type: string;
  extension_months: number | null;
  proposal_details: ProposalDetails;
  status: string;
  created_at: string;
  updated_at: string;
  is_extension: boolean;
}

interface Employer {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string | null;
  [key: string]: any;
}

interface Contract {
  id: number;
  employer_id: number;
  employee_id: number;
  agent_id: number | null;
  position: string;
  working_days_per_month: number;
  working_hours_per_week: number;
  working_hours_schedule: string;
  start_date: string;
  end_date: string;
  duration_months: number;
  status: string;
  terms: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_active: boolean;
  proposals: Proposal[];
  employer: Employer;
}

interface ContractProposal {
  contract: Contract;
  proposal: Proposal;
  employer: any;
}

interface ContractCardProps {
  proposal: ContractProposal;
  imageUrl: string;
}

const ContractCard: React.FC<ContractCardProps> = ({ proposal, imageUrl }) => {
  const navigate = useNavigate();

  // Add safety checks for the proposal structure
  if (!proposal || !proposal.contract || !proposal.proposal) {
    console.warn('Invalid proposal structure in ContractCard:', proposal);
    return null;
  }

  const { contract, proposal: proposalData, employer } = proposal;

  // Safely access employer name from the top-level employer object
  const employerName = employer
    ? `${employer.first_name || ''} ${employer.last_name || ''}`.trim()
    : 'Unknown Employer';

  // Safely format date
  let formattedDate = 'Unknown date';
  try {
    if (proposalData.created_at) {
      formattedDate = format(new Date(proposalData.created_at), 'MMM dd, yyyy');
    }
  } catch (error) {
    console.error('Error formatting date:', error);
  }

  // Safely create description
  const position = contract.position || 'Unknown';
  const status = proposalData.status || 'Unknown';
  const handleViewDetails = () => {
    navigate(`/employee/${contract.id}/proposal`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'accepted':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="relative">
        <img
          src={imageUrl}
          alt="Contract document"
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Contract
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-gray-400" />
          <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100 truncate">
            {employerName}
          </h3>
        </div>

        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
          <Briefcase className="w-4 h-4 text-gray-400" />
          <span className="truncate">{position}</span>
        </div>

        <div className="flex items-center gap-2 mb-3 text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              status
            )}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleViewDetails}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
          <button className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm font-medium py-2 px-4 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface ContractsPageProps {
  title?: string;
}

const ContractsPage: React.FC<ContractsPageProps> = ({
  title = 'My Contracts',
}) => {
  const [proposals, setProposals] = useState<ContractProposal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchContractProposals = async () => {
      try {
        setLoading(true);
        const response = await contractApi.getProposals();

        if (response.status && response.data) {
          // Ensure data is an array before setting it
          if (Array.isArray(response.data)) {
            setProposals(response.data);
          } else {
            console.error('Unexpected data format:', response.data);
            setError('Received invalid data format from server');
          }
        } else {
          setError('Failed to fetch contract proposals');
        }
      } catch (err) {
        console.error('Error fetching contract proposals:', err);
        setError('An error occurred while fetching contract proposals');
      } finally {
        setLoading(false);
      }
    };

    fetchContractProposals();
  }, []);

  // Filter proposals based on search term
  const filteredProposals = proposals.filter((proposal) => {
    if (!searchTerm) return true;

    // Add safety checks for the proposal structure
    if (!proposal || !proposal.contract || !proposal.proposal) {
      console.warn('Invalid proposal structure:', proposal);
      return false;
    }

    const searchLower = searchTerm.toLowerCase();

    // Safely access employer name from the top-level employer object
    const employerName = proposal.employer
      ? `${proposal.employer.first_name || ''} ${proposal.employer.last_name || ''}`
          .toLowerCase()
          .trim()
      : '';

    // Safely access position and status
    const position = (proposal.contract.position || '').toLowerCase();
    const status = (proposal.proposal.status || '').toLowerCase();

    return (
      employerName.includes(searchLower) ||
      position.includes(searchLower) ||
      status.includes(searchLower)
    );
  });

  return (
    <div className="p-0">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          View and manage all your employment contracts
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100">
        {/* Search Section */}
        <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by employer, position, status..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Results Count */}
          {!loading && !error && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Showing {filteredProposals.length} of {proposals.length} contract
              {proposals.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            </div>
          ) : filteredProposals.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {searchTerm
                      ? 'No contracts found'
                      : 'No contract proposals found'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {searchTerm
                      ? 'Try adjusting your search criteria'
                      : 'Contract proposals will appear here once created'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProposals.map((contractProposal) => (
                <ContractCard
                  key={contractProposal.proposal.id}
                  proposal={contractProposal}
                  imageUrl={ContractImg}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractsPage;
