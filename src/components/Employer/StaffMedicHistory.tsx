// MedicalHistory.tsx
import React from 'react';
import MedicalImg from '../../assets/images/medical.png'

interface MedicalHistoryProps {
  reportDate: string;
}

const MedicalHistory: React.FC<MedicalHistoryProps> = ({ reportDate }) => {
  return (
    <div className="">
      <div className="flex items-center justify-start mb-4">
          <img src={MedicalImg} alt="medical"/>
        <div>
          <h3 className="font-medium text-gray-800">Medical</h3>
          <p className="text-sm text-gray-600">Cali's medical report for the {reportDate}.</p>
          <button className="mt-2 bg-[#A5EA91] text-[#48525B] rounded-md px-3 py-1 text-sm">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;