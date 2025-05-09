import React from 'react';

interface CandidateWorkScheduleProps {
  candidateName: string;
  placement?: string;
  position?: string;
}

const CandidateWorkSchedule: React.FC<CandidateWorkScheduleProps> = ({
  candidateName,
  placement = "No employer assigned",
  position = "Not specified"
}) => {
  // Check if placement is "No employer assigned" or similar
  const hasPlacement = placement && !placement.toLowerCase().includes("no employer");

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg p-4">
        <div className="space-y-6">
          {/* Placement Section */}
          <div>
            <h3 className="text-gray-700 font-medium mb-2">Placement:</h3>
            <p className="text-gray-600">
              {hasPlacement ? placement : "No placement assigned"}
            </p>
            <div className="border-b border-gray-200 my-4"></div>
          </div>

          {/* Position Section */}
          <div>
            <h3 className="text-gray-700 font-medium mb-2">Position:</h3>
            <p className="text-gray-600">{position}</p>
            <div className="border-b border-gray-200 my-4"></div>
          </div>

          {/* Work Schedule Section */}
          <div>
            <h3 className="text-gray-700 font-medium mb-2">Work Schedule:</h3>
            <p className="text-gray-600">
              {hasPlacement ? "5 days in a week" : "Not applicable (no placement)"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateWorkSchedule;
