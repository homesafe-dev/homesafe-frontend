import React, { useState, useEffect } from 'react';
import { FiSearch, FiDownload } from 'react-icons/fi';
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

interface Employee {
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
  employer: any;
  employee?: Employee;
}

interface ContractProposal {
  contract: Contract;
  proposal: Proposal;
}

interface ContractCardProps {
  proposal: ContractProposal;
  imageUrl: string;
}

const ContractCard: React.FC<ContractCardProps> = ({
  proposal,
  imageUrl,
}) => {
  const { contract, proposal: proposalData } = proposal;
  const employeeName = contract.employee ?
    `${contract.employee.first_name} ${contract.employee.last_name}` :
    'Unknown Employee';

  const formattedDate = format(new Date(proposalData.created_at), 'MMM dd, yyyy');
  const description = `Contract proposal for ${contract.position} position. Created on ${formattedDate}. Status: ${proposalData.status}`;

  return (
    <div className="bg-white p-4 rounded-md border border-gray-100">
      <div className="mb-3">
        <img
          src={imageUrl}
          alt="Contract document"
          className="w-full h-[174px] object-cover rounded-sm"
        />
      </div>
      <h3 className="font-semibold text-[16px] text-[#24292E] mb-2">{employeeName}</h3>
      <p className="text-[13px] text-[#48525B] mb-3">{description}</p>
      <div className="flex justify-between items-center">
        <span className={`px-2 py-1 rounded-full text-xs ${
          proposalData.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
          proposalData.status === 'accepted' ? 'bg-green-100 text-green-700' :
          'bg-red-100 text-red-700'
        }`}>
          {proposalData.status.charAt(0).toUpperCase() + proposalData.status.slice(1)}
        </span>
        <button className="flex items-center justify-center rounded-[6px] text-[#6C7A89] text-xs border border-[#DCDEE5] w-[98px] h-[32px]">
          <FiDownload className="mr-1 text-black" size={14} />
          Download
        </button>
      </div>
    </div>
  );
};

interface ContractsPageProps {
  title?: string;
}

const ContractsPage: React.FC<ContractsPageProps> = ({
  title = 'All Contracts',
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
          setProposals(response.data);
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
  const filteredProposals = proposals.filter(proposal => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const employeeName = proposal.contract.employee ?
      `${proposal.contract.employee.first_name} ${proposal.contract.employee.last_name}`.toLowerCase() :
      '';
    const position = proposal.contract.position.toLowerCase();
    const status = proposal.proposal.status.toLowerCase();

    return employeeName.includes(searchLower) ||
           position.includes(searchLower) ||
           status.includes(searchLower);
  });

  return (
    <div className="rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#24292E]">{title}</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, position, status"
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
          {searchTerm ? 'No contracts match your search.' : 'No contract proposals found.'}
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
