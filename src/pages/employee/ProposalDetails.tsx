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

  const { employer } = proposalData;
  const employerName = `${employer.first_name} ${employer.last_name}`;

  // Generate a simple rating (you can replace this with actual rating data)
  const rating = 4; // Default rating

  return (
    <div className="rounded-md px-4 sm:px-0">
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => navigate('/employee/contracts')}
          className="text-[#246D51] hover:text-[#1a5a3e] text-xs sm:text-sm mb-4"
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
              {employer.avatar ? (
                <img
                  src={employer.avatar}
                  alt={employerName}
                  className="rounded-full w-20 h-20 sm:w-24 sm:h-24 object-cover border-4 border-white shadow-sm"
                />
              ) : (
                <div className="rounded-full w-20 h-20 sm:w-24 sm:h-24 bg-gray-300 flex items-center justify-center border-4 border-white shadow-sm">
                  <span className="text-white text-lg sm:text-xl font-semibold">
                    {employer.first_name.charAt(0)}
                    {employer.last_name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute top-1 right-1 w-3 h-3 sm:w-4 sm:h-4 border-2 border-white rounded-full bg-[#37A379]" />
            </div>

            {/* Name */}
            <h2 className="text-[14px] sm:text-[16px] text-gray-700 mt-[0.5rem] font-medium text-center">
              {employerName}
            </h2>

            {/* Rating */}
            <div className="flex mb-4 sm:mb-6 mt-2">
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
              <h3 className="text-[#246D51] font-semibold text-[14px] sm:text-[16px] mb-2">
                About me
              </h3>
              <p className="text-[12px] sm:text-[13px] text-[#48525B] mb-4 sm:mb-6">
                Meet {employer.first_name}, a passionate employer looking for
                dedicated staff. With a commitment to providing a great working
                environment, {employer.first_name}
                values professionalism and mutual respect in all working
                relationships.
              </p>

              {/* Contact Details */}
              <h3 className="text-[#246D51] font-semibold text-[14px] sm:text-[16px] mb-2">
                Contact Details
              </h3>
              <p className="text-[12px] sm:text-[13px] text-[#246D51] mb-3 sm:mb-4">
                {employer.phone}
              </p>

              {/* Email */}
              <h3 className="text-[#246D51] font-semibold text-[14px] sm:text-[16px] mb-2">
                Email
              </h3>
              <p className="text-[12px] sm:text-[13px] text-[#246D51] mb-4 sm:mb-6 break-all">
                {employer.email}
              </p>

              {/* View Contract Button */}
              <div className="mt-4">
                <button
                  onClick={() => navigate(`/employee/${contractId}/contract`)}
                  className="text-[#24292E] rounded-md py-2 text-sm w-full h-[34px] bg-[#A5EA91] hover:bg-[#A5EA91] transition-colors"
                >
                  View Contract
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsPage;
