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
  X,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import contractApi from '../../api/contractApi';
import Avatar from '../../components/common/Avatar';
import Toast from '../../components/common/Toast';

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

interface Employee {
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
  employee: Employee;
}

const EmployerProposalDetailsPage: React.FC = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const navigate = useNavigate();
  const [proposalData, setProposalData] = useState<ContractProposal | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [terminating, setTerminating] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  useEffect(() => {
    const fetchProposalDetails = async () => {
      try {
        setLoading(true);
        const response = await contractApi.getProposals();

        if (response.status && response.data) {
          // Find the specific proposal by contract ID
          const foundProposal = response.data.find(
            (proposal: ContractProposal) =>
              proposal.contract.id.toString() === contractId
          );

          if (foundProposal) {
            setProposalData(foundProposal);
          } else {
            setError('Proposal not found');
          }
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

  const handleTerminateContract = async () => {
    if (!proposalData) {
      setError('Contract data not found');
      return;
    }

    try {
      setTerminating(true);
      setError(null);

      const contractStatus = proposalData.contract.status?.toLowerCase();
      let response;

      // Check contract status and call appropriate endpoint
      if (contractStatus === 'pending') {
        // Use proposal ID for canceling pending contracts
        response = await contractApi.cancelContract(proposalData.proposal.id);
      } else if (contractStatus === 'active') {
        // Use contract ID for terminating active contracts
        response = await contractApi.terminateContract(
          proposalData.contract.id
        );
      } else {
        setError(
          `Cannot cancel/terminate contract with status: ${contractStatus}`
        );
        return;
      }

      if (response.status) {
        const action = contractStatus === 'pending' ? 'canceled' : 'terminated';
        setToast({
          message: response.message || `Contract ${action} successfully`,
          type: 'success',
          isVisible: true,
        });
        setShowConfirmation(false);
        // Navigate back to contracts page after a delay
        setTimeout(() => {
          navigate('/employer/contracts');
        }, 2000);
      } else {
        setToast({
          message:
            response.message ||
            `Failed to ${contractStatus === 'pending' ? 'cancel' : 'terminate'} contract`,
          type: 'error',
          isVisible: true,
        });
      }
    } catch (err: any) {
      const contractStatus = proposalData?.contract.status?.toLowerCase();
      const action = contractStatus === 'pending' ? 'canceling' : 'terminating';
      console.error(`Error ${action} contract:`, err);
      setToast({
        message:
          err.response?.data?.message ||
          `An error occurred while ${action} the contract`,
        type: 'error',
        isVisible: true,
      });
    } finally {
      setTerminating(false);
    }
  };

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
        <div className="bg-surface rounded-2xl p-8 border border-border-default shadow-sm text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No proposal data found.
          </p>
        </div>
      </div>
    );
  }

  const { employee, contract, proposal } = proposalData;
  const employeeName = `${employee.first_name} ${employee.last_name}`;

  // Generate a simple rating (you can replace this with actual rating data)
  const rating = 4; // Default rating

  return (
    <div className="p-0">
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <button
          onClick={() => navigate('/employer/contracts')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Contracts</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Contract Proposal
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
              Review proposal details for {employeeName}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-2xl p-6 border border-border-default shadow-sm">
            <div className="flex flex-col items-center">
              {/* Profile Image */}
              <div className="mb-4">
                <Avatar
                  src={employee.avatar}
                  firstName={employee.first_name}
                  lastName={employee.last_name}
                  size="lg"
                  showStatus={true}
                  isOnline={true}
                />
              </div>

              {/* Name */}
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {employeeName}
              </h2>

              {/* Position Badge */}
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
                <Briefcase className="w-4 h-4" />
                {contract.position || 'Staff'}
              </div>

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
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
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
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                      Phone
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {employee.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                      Email
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {employee.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="w-full mt-6 pt-6 border-t border-border-default">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  About
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Meet {employee.first_name}, a dedicated professional with
                  experience in {contract.position}. With a commitment to
                  excellence and reliability, {employee.first_name} brings
                  passion and expertise to every task, ensuring quality service
                  and professional standards.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Details Card */}
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-2xl p-6 border border-border-default shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Contract Details
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Proposal information and terms
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Position
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {contract.position || 'N/A'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Start Date
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {contract.start_date
                    ? format(new Date(contract.start_date), 'MMM dd, yyyy')
                    : 'N/A'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Duration
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {contract.duration_months ||
                    proposal.proposal_details.duration_months ||
                    0}{' '}
                  months
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Working Days/Month
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {contract.working_days_per_month ||
                    proposal.proposal_details.working_days_per_month ||
                    0}{' '}
                  days
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Working Hours/Week
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {contract.working_hours_per_week ||
                    proposal.proposal_details.working_hours_per_week ||
                    0}{' '}
                  hours
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </span>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    contract.status?.toLowerCase() === 'pending'
                      ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      : contract.status?.toLowerCase() === 'active'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-gray-50 text-gray-700 dark:text-gray-300 border border-border-default'
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

            {/* Action Buttons */}
            <div className="pt-6 border-t border-border-default flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(`/employer/${contractId}/contract`)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Full Contract
              </button>
              <button
                onClick={() => setShowConfirmation(true)}
                disabled={terminating}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {terminating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    {contract.status?.toLowerCase() === 'pending'
                      ? 'Canceling...'
                      : 'Terminating...'}
                  </>
                ) : (
                  <>
                    {contract.status?.toLowerCase() === 'pending' ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    {contract.status?.toLowerCase() === 'pending'
                      ? 'Cancel Contract'
                      : 'Terminate Contract'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Confirm Contract{' '}
                {proposalData?.contract.status?.toLowerCase() === 'pending'
                  ? 'Cancellation'
                  : 'Termination'}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to{' '}
              {proposalData?.contract.status?.toLowerCase() === 'pending'
                ? 'cancel'
                : 'terminate'}{' '}
              this contract with {employee?.first_name} {employee?.last_name}?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleTerminateContract}
                disabled={terminating}
                className="flex-1 px-4 py-2.5 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
              >
                {terminating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    {proposalData?.contract.status?.toLowerCase() === 'pending'
                      ? 'Canceling...'
                      : 'Terminating...'}
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    {proposalData?.contract.status?.toLowerCase() === 'pending'
                      ? 'Cancel'
                      : 'Terminate'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerProposalDetailsPage;
