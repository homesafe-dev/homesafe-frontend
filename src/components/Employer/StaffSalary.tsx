import React from 'react';

interface SalaryHistoryItem {
  paymentDate: string;
  accountDetails: {
    bank: string;
    accountNumber: string;
  };
  amount: string;
  salaryAdvance: string;
  redeemSalary: string;
  status: string;
}

interface SalaryProps {
  currentSalary: string;
  advancedLoan: string;
  accountDetails: {
    bank: string;
    accountNumber: string;
  };
  nextPaymentDate: string;
  salaryHistory: SalaryHistoryItem[];
}

const Salary: React.FC<SalaryProps> = ({
  currentSalary,
  advancedLoan,
  accountDetails,
  nextPaymentDate,
  salaryHistory,
}) => {
  return (
    <div className="p-6">
      <div className="flex gap-6 mb-8">
        {/* Salary Card */}
        <div className="flex-1 bg-[#C8EDDF1A] rounded-xl p-6 relative overflow-hidden">
          {/* Curved stripes decoration */}
          <div className="absolute top-0 right-0">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <path
                d="M60 0C60 33.1371 86.8629 60 120 60"
                stroke="#F3F4F6"
                strokeWidth="2"
              />
              <path
                d="M40 0C40 44.1828 75.8172 80 120 80"
                stroke="#F3F4F6"
                strokeWidth="2"
              />
              <path
                d="M20 0C20 55.2285 64.7715 100 120 100"
                stroke="#F3F4F6"
                strokeWidth="2"
              />
            </svg>
          </div>

          <h3 className="text-gray-600 text-lg">Salary</h3>
          <p className="text-4xl font-semibold mb-8">₦ {currentSalary}</p>

          <div className="flex justify-between">
            <div>
              <h4 className="text-gray-500 text-sm mb-1">Account Details:</h4>
              <p className="text-gray-700">{accountDetails.bank}</p>
              <p className="text-gray-700">{accountDetails.accountNumber}</p>
            </div>
            <div>
              <h4 className="text-gray-500 text-sm mb-1">Payment Date:</h4>
              <p className="text-gray-700">{nextPaymentDate}</p>
              <p className="text-gray-500 text-sm">Payment is automated</p>
            </div>
          </div>
        </div>

        {/* Salary Advanced/Loan Card */}
        <div className="flex-1 bg-white rounded-xl p-6 relative overflow-hidden">
          {/* Smooth S-curves decoration */}
          <div className="absolute bottom-0 right-0">
            <svg width="280" height="200" viewBox="0 0 280 200" fill="none">
              <path
                d="M280 200C280 200 280 160 260 130C240 100 240 70 280 40"
                stroke="#F3F4F6"
                strokeWidth="1"
              />
              <path
                d="M250 200C250 200 250 170 230 140C210 110 210 80 250 50"
                stroke="#F3F4F6"
                strokeWidth="1"
              />
              <path
                d="M220 200C220 200 220 180 200 150C180 120 180 90 220 60"
                stroke="#F3F4F6"
                strokeWidth="1"
              />
              <path
                d="M190 200C190 200 190 190 170 160C150 130 150 100 190 70"
                stroke="#F3F4F6"
                strokeWidth="1"
              />
            </svg>
          </div>

          <h3 className="text-gray-600 text-lg">Salary Advanced/Loan</h3>
          <p className="text-4xl font-semibold">₦ {advancedLoan || '-'}</p>
        </div>
      </div>

      {/* Salary History Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Salary History</h3>
          <button className="text-sm text-gray-600">View All</button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#C8EDDF80] h-[56px]">
              <tr>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">
                  Payment Date
                </th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">
                  Account Details
                </th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">
                  Amount
                </th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">
                  Salary Advance
                </th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">
                  Redeem Salary
                </th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {salaryHistory.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="px-4 py-3 text-sm">{item.paymentDate}</td>
                  <td className="px-4 py-3">
                    <p className="text-xs">{item.accountDetails.bank}</p>
                    <p className="text-xs">
                      {item.accountDetails.accountNumber}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm">{item.amount}</td>
                  <td className="px-4 py-3 text-sm">{item.salaryAdvance}</td>
                  <td className="px-4 py-3 text-sm">{item.redeemSalary}</td>
                  <td className="px-4 py-3">
                    <span className="bg-green-100 text-green-800 rounded-md px-2 py-1 text-xs">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Salary;
