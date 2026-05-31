import React from 'react';
import MedicalImg from '../../assets/images/medical.png';

interface MedicalFile {
  id: number;
  medical_file: string;
  date_uploaded: string;
}

interface CandidateMedicHistoryProps {
  medicalFiles?: MedicalFile[];
  candidateName: string;
}

const CandidateMedicHistory: React.FC<CandidateMedicHistoryProps> = ({
  medicalFiles = [],
  candidateName,
}) => {
  const handleViewMedical = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  if (medicalFiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center">
        <img
          src={MedicalImg}
          alt="medical"
          className="mb-3 sm:mb-4 opacity-50 w-16 h-16 sm:w-auto sm:h-auto"
        />
        <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2 text-sm sm:text-base">
          No Medical Records
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          No medical reports have been uploaded for {candidateName} yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 p-2 sm:p-0">
      {medicalFiles.map((medical) => (
        <div
          key={medical.id}
          className="flex flex-col sm:flex-row sm:items-center justify-start p-3 sm:p-4 border border-border-default rounded-lg gap-3 sm:gap-4"
        >
          <img
            src={MedicalImg}
            alt="medical"
            className="w-16 h-16 sm:w-auto sm:h-auto flex-shrink-0"
          />
          <div className="flex-1">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 text-sm sm:text-base">
              Medical Report
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {candidateName}'s medical report uploaded on{' '}
              {new Date(medical.date_uploaded).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              .
            </p>
            <button
              onClick={() => handleViewMedical(medical.medical_file)}
              className="mt-2 bg-[#A5EA91] text-[#48525B] rounded-md px-3 py-1 text-xs sm:text-sm hover:bg-[#95d481] transition-colors"
            >
              View Report
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CandidateMedicHistory;
