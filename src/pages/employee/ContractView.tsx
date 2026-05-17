import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
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

interface Employer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string | null;
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
  employer: Employer;
  employee: Employee;
}

const ContractViewPage: React.FC = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const navigate = useNavigate();
  const [proposalData, setProposalData] = useState<ContractProposal | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [responding, setResponding] = useState<boolean>(false);

  useEffect(() => {
    const fetchProposalDetails = async () => {
      try {
        setLoading(true);

        // Use the specific API endpoint for single proposal
        const response = await contractApi.getSingleProposal(
          Number(contractId)
        );

        if (response.status && response.data) {
          console.log('Single proposal response:', response.data);
          setProposalData(response.data);
        } else {
          setError('Failed to fetch contract details');
        }
      } catch (err) {
        console.error('Error fetching contract details:', err);
        setError('An error occurred while fetching contract details');
      } finally {
        setLoading(false);
      }
    };

    if (contractId) {
      fetchProposalDetails();
    }
  }, [contractId]);

  const handleBack = () => {
    navigate(`/employee/${contractId}/proposal`);
  };

  const handleDeclineContract = async () => {
    try {
      if (!proposalData?.proposal?.id) {
        setError('Proposal ID not found');
        return;
      }

      setResponding(true);
      setError(null);

      const response = await contractApi.respondToProposal(
        proposalData.proposal.id,
        'decline'
      );

      if (response.status) {
        // Navigate back to contracts page or show success message
        navigate('/employee/contracts');
      } else {
        setError('Failed to decline contract');
      }
    } catch (err) {
      console.error('Error declining contract:', err);
      setError('An error occurred while declining the contract');
    } finally {
      setResponding(false);
    }
  };

  const handleAcceptContract = async () => {
    try {
      if (!proposalData?.proposal?.id) {
        setError('Proposal ID not found');
        return;
      }

      setResponding(true);
      setError(null);

      const response = await contractApi.respondToProposal(
        proposalData.proposal.id,
        'accept'
      );

      if (response.status) {
        // Navigate back to contracts page or show success message
        navigate('/employee/contracts');
      } else {
        setError('Failed to accept contract');
      }
    } catch (err) {
      console.error('Error accepting contract:', err);
      setError('An error occurred while accepting the contract');
    } finally {
      setResponding(false);
    }
  };

  const handleDownloadPDF = () => {
    // Generate and download PDF
    window.print();
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

  if (
    !proposalData ||
    !proposalData.contract ||
    !proposalData.employer ||
    !proposalData.employee
  ) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No contract data found.
      </div>
    );
  }

  const { employer, employee, contract } = proposalData;
  const employerName = employer
    ? `${employer.first_name || ''} ${employer.last_name || ''}`.trim()
    : 'Unknown Employer';
  const employeeName = employee
    ? `${employee.first_name || ''} ${employee.last_name || ''}`.trim()
    : 'Unknown Employee';

  // Format dates
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-8">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 mb-4 sm:mb-6">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:text-gray-200 transition-colors text-sm sm:text-base"
        >
          <IoArrowBack className="mr-2" size={16} />
          <span className="sm:inline">Back</span>
        </button>
      </div>

      {/* Contract Document */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-[#246D51] mb-2">
              homesafe
            </h1>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Employment Contract Form
            </h2>
            <div className="w-full h-0.5 bg-[#246D51] mb-4 sm:mb-6"></div>
          </div>

          {/* Contract Content */}
          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              Homesafe Technology, a provider of Artisans and {employerName}{' '}
              (Employer) of No 5 thompson street, Lagos State and {employeeName}{' '}
              (Employee) of 5 Allen close, Lagos State. This Employment
              Agreement between:
            </p>

            <p>
              The Employer and Employee collectively referred to as "the
              Parties" hereby agree as follows:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  1. Position and Duties
                </h3>
                <p>
                  The Employer hereby employs the Employee in the position of{' '}
                  {contract?.position || 'Staff'}. The Employee agrees to
                  perform all duties and responsibilities associated with the
                  position, as assigned by the Employer from time to time, with
                  diligence and professionalism.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  2. Term of Employment
                </h3>
                <p>
                  This Agreement shall commence on{' '}
                  {contract?.start_date
                    ? formatDate(contract.start_date)
                    : 'TBD'}{' '}
                  and shall continue until staff decides to resign or
                  terminated.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  2b.
                </h3>
                <p>
                  The employment period for this role is{' '}
                  {contract?.duration_months || 'TBD'} months and can be renewed
                  or terminated depending on each party preference. This is done
                  to allow flexibility.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  3. Compensation and Benefits
                </h3>
                <p>
                  The Employee shall be paid a gross salary of [Amount] per
                  [month/year], subject to applicable taxes and deductions.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  4. Working Hours
                </h3>
                <p>
                  The Employee shall work{' '}
                  {contract?.working_hours_per_week || 'TBD'} hours per week,
                  from 9:00 am to 4:00 pm, [
                  {contract?.working_hours_schedule || 'Monday through Friday'}
                  ].
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Second Page */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#246D51] mb-2">homesafe</h1>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Employment Contract Form
            </h2>
            <div className="w-full h-0.5 bg-[#246D51] mb-6"></div>
          </div>

          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                5. Termination of Employment
              </h3>
              <p className="mb-4">
                This Agreement may be terminated by either party with notice
                period written notice.
              </p>
              <p>
                The Employer may terminate this Agreement without notice for
                cause, including but not limited to gross misconduct or breach
                of this Agreement.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                6. Amendments
              </h3>
              <p className="mb-4">
                Any amendments to this Agreement must be made in writing and
                signed by both Parties.
              </p>
              <p>
                IN WITNESS WHEREOF, the Parties have executed this Agreement as
                of the date first above written.
              </p>
            </div>

            {/* Signature Section */}
            <div className="mt-12 space-y-8">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Employer
                </h4>
                <div className="space-y-2">
                  <p>Signature: _________________________</p>
                  <p>Name: {employerName}</p>
                  <p>Date: {formatDate(new Date().toISOString())}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Employee
                </h4>
                <div className="space-y-2">
                  <p>Signature: _________________________</p>
                  <p>Name: {employeeName}</p>
                  <p>Date: {formatDate(new Date().toISOString())}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto px-4 mb-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          {proposalData.proposal.status === 'accepted' ? (
            // Show Download PDF button if contract is accepted
            <button
              onClick={handleDownloadPDF}
              className="px-8 py-3 bg-[#37A379] text-white rounded-md hover:bg-[#2d8a63] transition-colors"
            >
              Download PDF
            </button>
          ) : proposalData.proposal.status === 'pending' ? (
            // Show Accept/Decline buttons if contract is pending
            <>
              <button
                onClick={handleDeclineContract}
                disabled={responding}
                className={`px-8 py-3 bg-transparent border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors ${
                  responding ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {responding ? 'Processing...' : 'Decline Contract'}
              </button>
              <button
                onClick={handleAcceptContract}
                disabled={responding}
                className={`px-8 py-3 bg-[#37A379] text-white rounded-md hover:bg-[#2d8a63] transition-colors ${
                  responding ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {responding ? 'Processing...' : 'Accept Contract'}
              </button>
            </>
          ) : (
            // Show status message for declined or other statuses
            <div className="text-center py-4">
              <p className="text-gray-600 dark:text-gray-400">
                Contract status:{' '}
                <span className="font-semibold capitalize">
                  {proposalData.proposal.status}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractViewPage;
