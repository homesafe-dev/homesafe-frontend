import React, { useState } from 'react';
import TerminateStaffModal from './TerminateStaffModal';
import TerminateContractConfirmation from './TerminateConfirmation';
import contractApi from '../../api/contractApi';
import Toast from '../common/Toast';
import Avatar from '../common/Avatar';

interface StaffProfileAboutProps {
  name: string;
  location: string;
  age: number;
  role: string;
  bio: string;
  phone: string;
  email: string;
  profileImage: string;
  rating: number;
  isOnline?: boolean;
  contractId?: number; // Contract ID for termination
  contractStatus?: string; // Contract status (pending, active, etc.)
  proposalId?: number; // Proposal ID for cancellation
}

const StaffProfileAbout: React.FC<StaffProfileAboutProps> = ({
  name,
  location,
  age,
  role,
  bio,
  phone,
  email,
  profileImage,
  isOnline = true,
  contractId,
  contractStatus,
  proposalId,
}) => {
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedNoticePeriod, setSelectedNoticePeriod] = useState('');
  const [isTerminating, setIsTerminating] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleOpenTerminateModal = () => {
    setIsTerminateModalOpen(true);
  };

  const handleCloseTerminateModal = () => {
    setIsTerminateModalOpen(false);
  };

  const handleSubmitTermination = async (noticePeriod: string) => {
    setSelectedNoticePeriod(noticePeriod);
    setIsTerminateModalOpen(false);

    // Check if contractId is available
    if (!contractId) {
      showToast('Contract ID not found. Cannot terminate contract.', 'error');
      return;
    }

    try {
      setIsTerminating(true);

      const status = contractStatus?.toLowerCase();
      let response;

      // Check contract status and call appropriate endpoint
      if (status === 'pending') {
        // Use proposal ID for canceling pending contracts
        if (!proposalId) {
          showToast('Proposal ID not found. Cannot cancel contract.', 'error');
          return;
        }
        response = await contractApi.cancelContract(proposalId);
      } else if (status === 'active') {
        // Use contract ID for terminating active contracts
        if (!contractId) {
          showToast(
            'Contract ID not found. Cannot terminate contract.',
            'error'
          );
          return;
        }
        response = await contractApi.terminateContract(contractId);
      } else {
        showToast(
          `Cannot cancel/terminate contract with status: ${status}`,
          'error'
        );
        return;
      }

      if (response.status) {
        const action = status === 'pending' ? 'canceled' : 'terminated';
        showToast(
          response.message || `Contract ${action} successfully`,
          'success'
        );
        setIsConfirmationOpen(true);
      } else {
        showToast(
          response.message ||
            `Failed to ${status === 'pending' ? 'cancel' : 'terminate'} contract`,
          'error'
        );
      }
    } catch (error: any) {
      const status = contractStatus?.toLowerCase();
      const action = status === 'pending' ? 'canceling' : 'terminating';
      console.error(`Error ${action} contract:`, error);
      showToast(
        error.response?.data?.message ||
          `An error occurred while ${action} the contract`,
        'error'
      );
    } finally {
      setIsTerminating(false);
    }
  };

  const handleCloseConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-lg p-3 sm:p-4 h-full">
      <div className="mb-3 sm:mb-4">
        <Avatar
          src={profileImage}
          firstName={name.split(' ')[0] || ''}
          lastName={name.split(' ')[1] || ''}
          size="lg"
          showStatus={true}
          isOnline={isOnline}
          className="border-4 border-white"
        />
      </div>

      <h2 className="text-sm sm:text-[16px] text-gray-700 mt-2 sm:mt-[0.5rem] font-medium text-center">
        {name}
      </h2>
      <p className="text-xs sm:text-[13px] mt-2 sm:mt-[0.5rem] text-[#24292E] mb-2 text-center">
        {location} | {age} yrs old
      </p>

      <div className="bg-[#C8EDDF80] mt-2 sm:mt-[0.5rem] text-[#48525B] min-w-[64px] h-[26px] flex items-center justify-center px-2 sm:px-3 py-1 rounded-[8px] text-xs sm:text-[13px] mb-2">
        {role}
      </div>

      <div className="flex mb-4 sm:mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-[#EFAE73] mt-2 sm:mt-[0.5rem] text-sm sm:text-base ${star <= 4 ? 'opacity-100' : 'opacity-30'}`}
          >
            ★
          </span>
        ))}
      </div>

      <div className="w-full">
        <h3 className="text-[#246D51] font-semibold text-sm sm:text-[16px] mb-2">
          About me
        </h3>
        <p className="text-xs sm:text-[13px] text-[#48525B] mb-4 sm:mb-6 leading-relaxed">
          {bio}
        </p>

        <h3 className="text-[#246D51] font-semibold text-sm sm:text-[16px] mb-2">
          Contact Details
        </h3>
        <p className="text-xs sm:text-[13px] text-[#246D51] break-all">
          {phone}
        </p>

        <h3 className="text-[#246D51] font-semibold text-sm sm:text-[16px] mt-3 sm:mt-4 mb-2">
          Email
        </h3>
        <p className="text-xs sm:text-[13px] text-[#246D51] break-all">
          {email}
        </p>

        <div className="mt-3 sm:mt-4">
          <button
            className="text-white rounded-md py-2 text-xs sm:text-sm w-full sm:w-[117px] h-[34px] bg-[#993018] hover:bg-[#7d2a1f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleOpenTerminateModal}
            disabled={isTerminating || !contractId}
          >
            {isTerminating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-1"></div>
                <span className="text-xs">
                  {contractStatus?.toLowerCase() === 'pending'
                    ? 'Canceling...'
                    : 'Terminating...'}
                </span>
              </div>
            ) : contractStatus?.toLowerCase() === 'pending' ? (
              'Cancel Staff'
            ) : (
              'Terminate Staff'
            )}
          </button>
        </div>
      </div>

      <TerminateStaffModal
        isOpen={isTerminateModalOpen}
        onClose={handleCloseTerminateModal}
        onSubmit={handleSubmitTermination}
      />

      <TerminateContractConfirmation
        isOpen={isConfirmationOpen}
        employeeName={name}
        terminationPeriod={selectedNoticePeriod}
        onClose={handleCloseConfirmation}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default StaffProfileAbout;
