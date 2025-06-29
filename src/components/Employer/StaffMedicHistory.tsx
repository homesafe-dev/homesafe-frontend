import React from 'react';
import MedicalImg from '../../assets/images/medical.png';

interface MedicalFile {
  id: number;
  user_id: number;
  medical_file: string;
  date_uploaded: string;
  created_at: string;
  updated_at: string;
}

interface MedicalHistoryProps {
  medicalFiles?: MedicalFile[];
  employeeName?: string;
}

const MedicalHistory: React.FC<MedicalHistoryProps> = ({
  medicalFiles = [],
  employeeName = 'Employee',
}) => {
  const handleViewMedical = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  if (medicalFiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <img src={MedicalImg} alt="medical" className="mb-4 opacity-50" />
        <h3 className="font-medium text-gray-800 mb-2">No Medical Records</h3>
        <p className="text-sm text-gray-600">
          No medical reports have been uploaded for {employeeName} yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {medicalFiles.map((medical) => (
        <div
          key={medical.id}
          className="flex items-center justify-start p-4 border border-gray-200 rounded-lg"
        >
          <img src={MedicalImg} alt="medical" className="mr-4" />
          <div className="flex-1">
            <h3 className="font-medium text-gray-800">Medical Report</h3>
            <p className="text-sm text-gray-600">
              {employeeName}'s medical report uploaded on{' '}
              {new Date(medical.date_uploaded).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              .
            </p>
            <button
              onClick={() => handleViewMedical(medical.medical_file)}
              className="mt-2 bg-[#A5EA91] text-[#48525B] rounded-md px-3 py-1 text-sm hover:bg-[#95d481] transition-colors"
            >
              View Report
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicalHistory;
