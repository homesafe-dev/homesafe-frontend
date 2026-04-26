import React from 'react';
import NoLoanImg from '../../assets/images/noitem.png';

const Loan: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 h-64">
      <div className="bg-gray-100 p-4 rounded-lg mb-4 mt-[5rem]">
        <img src={NoLoanImg} alt="" />
      </div>
      <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
        Nothing Here
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        This user has no loan
      </p>
    </div>
  );
};

export default Loan;
