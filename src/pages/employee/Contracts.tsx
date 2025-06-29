import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ContractImg from '../../assets/images/Contract.png';
import TerminateStaffModal from '../../components/Employer/TerminateStaffModal';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Safely format dates
  let startDate = 'Unknown';
  let endDate = 'Unknown';
  try {
    if (contract.start_date) {
      startDate = format(new Date(contract.start_date), 'MMM dd, yyyy');
    }
    if (contract.end_date) {
      endDate = format(new Date(contract.end_date), 'MMM dd, yyyy');
    }
  } catch (error) {
    console.error('Error formatting dates:', error);
  }

  // Safely create description
  const position = contract.position || 'Unknown';
  const durationMonths = contract.duration_months || 'Unknown';
  const workingDays = contract.working_days_per_month || 'Unknown';
  const workingHours = contract.working_hours_per_week || 'Unknown';
  const description = `${position} position. Duration: ${durationMonths} months (${startDate} - ${endDate}). Working days: ${workingDays}/month, ${workingHours} hours/week.`;

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitTermination = () => {
    // Handle the termination submission here
    setIsModalOpen(false);
  };

  const handleViewDetails = () => {
    navigate(`/employee/${contract.id}/proposal`);
  };

  // Safely get status
  const status = proposalData.status || 'Unknown';

  return (
    <div className="bg-white p-4 rounded-md border border-gray-100">
      <div className="mb-3">
        <img
          src={imageUrl}
          alt="Contract document"
          className="w-full h-[174px] object-cover rounded-sm"
        />
      </div>
      <h3 className="font-semibold text-[16px] text-[#24292E] mb-2">
        {employerName}
      </h3>
      <p className="text-[13px] text-[#48525B] mb-3">{description}</p>

      <div className="flex justify-between items-center mb-3">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            status === 'pending'
              ? 'bg-yellow-100 text-yellow-700'
              : status === 'accepted'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleViewDetails}
          className="flex-1 flex items-center justify-center rounded-[6px] text-[#24292E] text-sm border border-[#A5EA91] hover:bg-[#A5EA91] hover:text-white transition-colors h-[32px]"
        >
          View Details
        </button>

        {/* {isActive && (
          <button
            onClick={handleOpenModal}
            className="flex-1 flex items-center justify-center rounded-[6px] text-white text-sm bg-[#963123] hover:bg-[#7d2a1f] h-[32px]"
          >
            Terminate
          </button>
        )} */}
      </div>

      <TerminateStaffModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTermination}
      />
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
    <div className="rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#24292E]">{title}</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by employer, position, status"
            className="pl-8 pr-4 py-2 border border-gray-100 rounded-[16px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-[480px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : filteredProposals.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {searchTerm
            ? 'No contracts match your search.'
            : 'No contract proposals found.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
  );
};

export default ContractsPage;
