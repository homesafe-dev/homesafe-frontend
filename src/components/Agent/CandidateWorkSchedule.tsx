import React from 'react';

interface CandidateWorkScheduleProps {
  candidateName: string;
  placement?: string;
  position?: string;
}

const CandidateWorkSchedule: React.FC<CandidateWorkScheduleProps> = ({
  // candidateName is not used in this component but kept in props for future use
  placement = 'No employer assigned',
  position = 'Not specified',
}) => {
  // Check if placement is "No employer assigned" or similar
  const hasPlacement =
    placement && !placement.toLowerCase().includes('no employer');

  return (
    <div className="p-3 sm:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4">
        <div className="space-y-4 sm:space-y-6">
          {/* Placement Section */}
          <div>
            <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm sm:text-base">
              Placement:
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              {hasPlacement ? placement : 'No placement assigned'}
            </p>
            <div className="border-b border-gray-200 dark:border-gray-700 my-3 sm:my-4"></div>
          </div>

          {/* Position Section */}
          <div>
            <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm sm:text-base">
              Position:
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              {position}
            </p>
            <div className="border-b border-gray-200 dark:border-gray-700 my-3 sm:my-4"></div>
          </div>

          {/* Work Schedule Section */}
          <div>
            <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm sm:text-base">
              Work Schedule:
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              {hasPlacement
                ? '5 days in a week'
                : 'Not applicable (no placement)'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateWorkSchedule;
