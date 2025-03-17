// StaffProfileAbout.tsx
import React, { useState } from 'react';
import TerminateStaffModal from './TerminateStaffModal';
import TerminateContractConfirmation from './TerminateConfirmation';

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
}) => {
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedNoticePeriod, setSelectedNoticePeriod] = useState('');

  const handleOpenTerminateModal = () => {
    setIsTerminateModalOpen(true);
  };

  const handleCloseTerminateModal = () => {
    setIsTerminateModalOpen(false);
  };

  const handleSubmitTermination = (noticePeriod: string) => {
    setSelectedNoticePeriod(noticePeriod);
    setIsTerminateModalOpen(false);
    setIsConfirmationOpen(true);
  };

  const handleCloseConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-lg p-4 h-full">
      <div className="mb-4 relative">
        <img 
          src={profileImage} 
          alt={name} 
          className="rounded-full w-24 h-24 object-cover border-4 border-white"
        />
        <div 
          className={`absolute top-1 right-1 w-4 h-4 border-2 border-white rounded-full ${isOnline ? 'bg-[#37A379]' : 'bg-gray-400'}`}
        />
      </div>
      
      <h2 className="text-[16px] text-gray-700 mt-[0.5rem] font-medium">{name}</h2>
      <p className="text-[13px] mt-[0.5rem] text-[#24292E] mb-2">{location} | {age} yrs old</p>
      
      <div className="bg-[#C8EDDF80] mt-[0.5rem] text-[#48525B] w-[64px] h-[26px] flex items-center justify-center px-3 py-1 rounded-[8px] text-[13px] mb-2">
            {role}
          </div>
      
          <div className="flex mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={`text-[#EFAE73] mt-[0.5rem] ${star <= 4 ? 'opacity-100' : 'opacity-30'}`}>
                ★
              </span>
            ))}
          </div>
      
      <div className="w-full">
        <h3 className="text-[#246D51] font-semibold text-[16px] mb-2">About me</h3>
        <p className="text-[13px] text-[#48525B] mb-6">{bio}</p>
        
        <h3 className="text-[#246D51] font-semibold text-[16px] mb-2">Contact Details</h3>
        <p className="text-[13px] text-[#246D51]">{phone}</p>
        
        <h3 className="text-[#246D51] font-semibold text-[16px] mt-4 mb-2">Email</h3>
        <p className="text-[13px] text-[#246D51]">{email}</p>
        
        <div className="mt-4">
          <button 
            className="text-white rounded-md py-2 text-sm w-[117px] h-[34px] bg-[#993018]"
            onClick={handleOpenTerminateModal}
          >
            Terminate Staff
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
    </div>
  );
};

export default StaffProfileAbout;