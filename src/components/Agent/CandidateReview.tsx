import React from 'react';
import { AiFillStar } from 'react-icons/ai';

interface CandidateReviewProps {
  candidateId: number;
  candidateName: string;
  bio?: string;
  gender?: string;
}

const CandidateReview: React.FC<CandidateReviewProps> = ({
  candidateName,
  bio,
  gender = 'female',
}) => {
  // Generate a default bio if none is provided
  const defaultBio = `Meet ${candidateName}, a ${gender} domestic staff. ${candidateName} is dedicated to providing quality service.`;

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-medium text-gray-800 mb-2">
          {candidateName}
        </h2>
        <p className="text-gray-600 mb-3">{bio || defaultBio}</p>
        <div className="flex">
          {[...Array(5)].map((_, index) => (
            <AiFillStar
              key={index}
              className={index < 4 ? 'text-[#EFAE73]' : 'text-gray-300'}
              size={20}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateReview;
