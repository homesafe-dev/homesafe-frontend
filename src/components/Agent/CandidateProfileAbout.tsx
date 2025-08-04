import React from 'react';
import Avatar from '../common/Avatar';

interface CandidateProfileAboutProps {
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
  showAdminActions?: boolean;
  isBlocked?: boolean;
  onBlockUser?: () => void;
  onUnblockUser?: () => void;
  onSuspendUser?: () => void;
  onAssignEmployer?: () => void;
}

const CandidateProfileAbout: React.FC<CandidateProfileAboutProps> = ({
  name,
  location,
  age,
  role,
  bio,
  phone,
  email,
  profileImage,
  rating,
  isOnline = true,
  showAdminActions = false,
  isBlocked = false,
  onBlockUser,
  onUnblockUser,
  onSuspendUser,
  onAssignEmployer,
}) => {
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
        {location} {age > 0 ? `| ${age} yrs old` : ''}
      </p>

      <div className="bg-[#C8EDDF80] mt-2 sm:mt-[0.5rem] text-[#48525B] min-w-[64px] h-[26px] flex items-center justify-center px-2 sm:px-3 py-1 rounded-[8px] text-xs sm:text-[13px] mb-2 whitespace-nowrap">
        {role}
      </div>

      <div className="flex mb-4 sm:mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-[#EFAE73] mt-2 sm:mt-[0.5rem] text-sm sm:text-base ${star <= Math.round(rating) ? 'opacity-100' : 'opacity-30'}`}
          >
            ★
          </span>
        ))}
      </div>

      <div className="w-full">
        <h3 className="text-[#246D51] font-semibold text-sm sm:text-[16px] mb-2">
          About
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

        {/* Assign to Employer Button */}
        {onAssignEmployer && (
          <div className="mt-4 sm:mt-6">
            <button
              onClick={onAssignEmployer}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Suggest to Employer
            </button>
          </div>
        )}

        {showAdminActions && (
          <div className="mt-4 sm:mt-6 flex gap-2">
            {isBlocked ? (
              <button
                onClick={onUnblockUser}
                className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-md w-full text-sm"
              >
                Unblock User
              </button>
            ) : (
              <button
                onClick={onBlockUser}
                className="bg-[#993018] text-white px-3 sm:px-4 py-2 rounded-md w-full text-sm"
              >
                Block User
              </button>
            )}
            {/* <button
              onClick={onSuspendUser}
              className="border border-[#993018] text-[#993018] px-4 py-2 rounded-md w-full"
            >
              Suspend User
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateProfileAbout;
