import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import contractApi from '../../api/contractApi';

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      setSuccessMessage(null);

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
        setSuccessMessage(
          response.message || `Contract ${action} successfully`
        );
        setShowConfirmation(false);
        // Optionally navigate back to contracts page after a delay
        setTimeout(() => {
          navigate('/employer/contracts');
        }, 2000);
      } else {
        setError(
          `Failed to ${contractStatus === 'pending' ? 'cancel' : 'terminate'} contract`
        );
      }
    } catch (err: any) {
      const contractStatus = proposalData?.contract.status?.toLowerCase();
      const action = contractStatus === 'pending' ? 'canceling' : 'terminating';
      console.error(`Error ${action} contract:`, err);
      setError(
        err.response?.data?.message ||
          `An error occurred while ${action} the contract`
      );
    } finally {
      setTerminating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  if (!proposalData) {
    return (
      <div className="text-center py-12 text-gray-500">
        No proposal data found.
      </div>
    );
  }

  const { employee, contract } = proposalData;
  const employeeName = `${employee.first_name} ${employee.last_name}`;

  // Generate a simple rating (you can replace this with actual rating data)
  const rating = 4; // Default rating

  return (
    <div className="rounded-md p-3 sm:p-4 lg:p-6">
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => navigate('/employer/contracts')}
          className="text-[#246D51] hover:text-[#1a5a3e] text-sm mb-4 flex items-center"
        >
          ← Back to All Contracts
        </button>
        <h2 className="text-lg sm:text-xl font-semibold text-[#24292E]">
          Contract Details
        </h2>
      </div>

      <div className="flex justify-center">
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100 w-full max-w-md">
          <div className="flex flex-col items-center">
            {/* Profile Image */}
            <div className="mb-3 sm:mb-4 relative">
              {employee.avatar ? (
                <img
                  src={employee.avatar}
                  alt={employeeName}
                  className="rounded-full w-20 h-20 sm:w-24 sm:h-24 object-cover border-4 border-white shadow-sm"
                />
              ) : (
                <div className="rounded-full w-20 h-20 sm:w-24 sm:h-24 bg-gray-300 flex items-center justify-center border-4 border-white shadow-sm">
                  <span className="text-white text-lg sm:text-xl font-semibold">
                    {employee.first_name.charAt(0)}
                    {employee.last_name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute top-1 right-1 w-3 h-3 sm:w-4 sm:h-4 border-2 border-white rounded-full bg-[#37A379]" />
            </div>

            {/* Name */}
            <h2 className="text-sm sm:text-[16px] text-gray-700 mt-2 sm:mt-[0.5rem] font-medium text-center">
              {employeeName}
            </h2>

            {/* Position Badge */}
            <div className="bg-[#C8EDDF80] mt-2 sm:mt-[0.5rem] text-[#48525B] w-auto px-2 sm:px-3 py-1 rounded-[8px] text-xs sm:text-[13px] mb-2">
              {contract.position}
            </div>

            {/* Rating */}
            <div className="flex mb-4 sm:mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-[#EFAE73] text-sm sm:text-base ${star <= rating ? 'opacity-100' : 'opacity-30'}`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* About me section */}
            <div className="w-full">
              <h3 className="text-[#246D51] font-semibold text-sm sm:text-[16px] mb-2">
                About me
              </h3>
              <p className="text-xs sm:text-[13px] text-[#48525B] mb-4 sm:mb-6 leading-relaxed">
                Meet {employee.first_name}, a dedicated professional with
                experience in {contract.position}. With a commitment to
                excellence and reliability, {employee.first_name} brings passion
                and expertise to every task, ensuring quality service and
                professional standards.
              </p>

              {/* Contact Details */}
              <h3 className="text-[#246D51] font-semibold text-sm sm:text-[16px] mb-2">
                Contact Details
              </h3>
              <p className="text-xs sm:text-[13px] text-[#246D51] mb-3 sm:mb-4 break-all">
                {employee.phone}
              </p>

              {/* Email */}
              <h3 className="text-[#246D51] font-semibold text-sm sm:text-[16px] mb-2">
                Email
              </h3>
              <p className="text-xs sm:text-[13px] text-[#246D51] mb-4 sm:mb-6 break-all">
                {employee.email}
              </p>

              {/* Terminate/Cancel Contract Button */}
              <div className="mt-3 sm:mt-4">
                <button
                  onClick={() => setShowConfirmation(true)}
                  disabled={terminating}
                  className="text-white rounded-md py-2 text-xs sm:text-sm w-full h-[34px] bg-[#dc3545] hover:bg-[#c82333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {terminating
                    ? contract.status?.toLowerCase() === 'pending'
                      ? 'Canceling...'
                      : 'Terminating...'
                    : contract.status?.toLowerCase() === 'pending'
                      ? 'Cancel Contract'
                      : 'Terminate Contract'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          {successMessage}
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Contract{' '}
              {proposalData?.contract.status?.toLowerCase() === 'pending'
                ? 'Cancellation'
                : 'Termination'}
            </h3>
            <p className="text-gray-600 mb-6">
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
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTerminateContract}
                disabled={terminating}
                className="flex-1 px-4 py-2 text-white bg-[#dc3545] rounded-md hover:bg-[#c82333] transition-colors disabled:opacity-50"
              >
                {terminating
                  ? proposalData?.contract.status?.toLowerCase() === 'pending'
                    ? 'Canceling...'
                    : 'Terminating...'
                  : proposalData?.contract.status?.toLowerCase() === 'pending'
                    ? 'Cancel'
                    : 'Terminate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerProposalDetailsPage;
