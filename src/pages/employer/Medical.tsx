import React from 'react';
import { FiSearch } from 'react-icons/fi';
import MedicalImg from '../../assets/images/MedicalBig.png'
import { AiOutlineEye } from 'react-icons/ai';

interface MedicalReportCardProps {
  date: string;
}

const MedicalReportCard: React.FC<MedicalReportCardProps> = ({ date }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="mb-4">
        <img
          src={MedicalImg}
          alt="Medical Report"
          className="w-full h-40 object-cover rounded-lg"
        />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Medical Report</h3>
      <p className="text-gray-600 text-sm mb-4">
        Here is your medical report for the {date}.
      </p>
      <button className="inline-flex items-center justify-center text-[#6C7A89] text-sm font-medium border border-[#DCDEE5] w-[88px] h-[32px] rounded-[6px]">
        <AiOutlineEye className="mr-2" />
        View
      </button>
    </div>
  );
};

const Medical: React.FC = () => {
  const reports = [
    { id: 1, date: '24th November' },
    { id: 2, date: '24th November' },
    { id: 3, date: '24th November' },
    { id: 4, date: '24th November' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Medical Report</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by date, staff name"
            className="pl-10 pr-4 py-2 w-[480px] border border-gray-100 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {reports.map((report) => (
          <MedicalReportCard key={report.id} date={report.date} />
        ))}
      </div>
    </div>
  );
};

export default Medical;
