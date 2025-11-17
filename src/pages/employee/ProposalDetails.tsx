import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Star,
  FileText,
  Calendar,
  Clock,
  Briefcase,
  Eye,
} from 'lucide-react';
import { format } from 'date-fns';
import contractApi from '../../api/contractApi';
import Avatar from '../../components/common/Avatar';

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
  type: string;
  status: string;
  proposed_by: number;
  proposal_details: ProposalDetails;
  created_at: string;
  updated_at: string;
}

interface Contract {
  id: number;
  position: string;
  working_days_per_month: number;
  working_hours_per_week: number;
  working_hours_schedule: string;
  start_date: string;
  end_date: string;
  duration_months: number;
  status: string;
}

interface Employer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string | null;
}

interface ContractProposal {
  contract: Contract;
  proposal: Proposal;
  employer: Employer;
}

const ProposalDetailsPage: React.FC = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const navigate = useNavigate();
  const [proposalData, setProposalData] = useState<ContractProposal | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposalDetails = async () => {
      try {
        setLoading(true);

        // Use the specific API endpoint for single proposal
        const response = await contractApi.getSingleProposal(
          Number(contractId)
        );

        if (response.status && response.data) {
          setProposalData(response.data);
        } else {
          setError('Failed to fetch proposal details');
        }
      } catch (err) {
        console.error('Error fetching proposal details:', err);
        setError('An error occurred while fetching proposal details');
      } finally {
        setLoading(false);
      }
    };

    if (contractId) {
      fetchProposalDetails();
    }
  }, [contractId]);

  if (loading) {
    return (
      <div className="p-0">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-0">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!proposalData) {
    return (
      <div className="p-0">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No proposal data found.</p>
        </div>
      </div>
    );
  }

  const { employer, contract, proposal } = proposalData;
  const employerName = `${employer.first_name} ${employer.last_name}`;

  // Generate a simple rating (you can replace this with actual rating data)
  const rating = 4; // Default rating

  return (
    <div className="p-0">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <button
          onClick={() => navigate('/employee/contracts')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Contracts</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Contract Proposal
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Review proposal details from {employerName}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employer Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex flex-col items-center">
              {/* Profile Image */}
              <div className="mb-4">
                <Avatar
                  src={employer.avatar}
                  firstName={employer.first_name}
                  lastName={employer.last_name}
                  size="lg"
                  showStatus={true}
                  isOnline={true}
                />
              </div>

              {/* Name */}
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {employerName}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {rating.toFixed(1)}
                </span>
              </div>

              {/* Contact Information */}
              <div className="w-full space-y-4 mt-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {employer.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {employer.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="w-full mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  About
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Meet {employer.first_name}, a passionate employer looking for
                  dedicated staff. With a commitment to providing a great
                  working environment, {employer.first_name} values
                  professionalism and mutual respect in all working
                  relationships.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Details Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Contract Details
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Proposal information and terms
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">
                    Position
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {contract.position || 'N/A'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">
                    Start Date
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {contract.start_date
                    ? format(new Date(contract.start_date), 'MMM dd, yyyy')
                    : 'N/A'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">
                    Duration
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {contract.duration_months ||
                    proposal.proposal_details.duration_months ||
                    0}{' '}
                  months
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">
                    Working Days/Month
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {contract.working_days_per_month ||
                    proposal.proposal_details.working_days_per_month ||
                    0}{' '}
                  days
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">
                    Working Hours/Week
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {contract.working_hours_per_week ||
                    proposal.proposal_details.working_hours_per_week ||
                    0}{' '}
                  hours
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">
                    Status
                  </span>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    contract.status?.toLowerCase() === 'pending'
                      ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      : contract.status?.toLowerCase() === 'active'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-gray-50 text-gray-700 border border-gray-200'
                  }`}
                >
                  {contract.status || proposal.status || 'Pending'}
                </span>
              </div>
            </div>

            {/* Schedule */}
            {contract.working_hours_schedule ||
            proposal.proposal_details.working_hours_schedule ? (
              <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-900">
                    Working Schedule
                  </span>
                </div>
                <p className="text-sm text-indigo-700">
                  {contract.working_hours_schedule ||
                    proposal.proposal_details.working_hours_schedule}
                </p>
              </div>
            ) : null}

            {/* Action Button */}
            <div className="pt-6 border-t border-gray-100">
              <button
                onClick={() => navigate(`/employee/${contractId}/contract`)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Full Contract
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsPage;
