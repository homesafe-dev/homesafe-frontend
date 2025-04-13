import React from 'react';

interface Transaction {
  id: string;
  type: string;
  date: string;
  amount: number;
  description: string;
  from: string;
}

const Salary: React.FC = () => {
  // Sample transactions data
  const transactions: Transaction[] = [
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'November Salary',
      from: 'Homesafe',
    },
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'November Salary',
      from: 'Homesafe',
    },
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'November Salary',
      from: 'Homesafe',
    },
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'November Salary',
      from: 'Homesafe',
    },
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'November Salary',
      from: 'GHomesafe',
    },
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'November Salary',
      from: 'Homesafe',
    },
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'November Salary',
      from: 'Homesafe',
    },
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'November Salary',
      from: 'Homesafe',
    },
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'November Salary',
      from: 'Homesafe',
    },
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'November Salary',
      from: 'Homesafe',
    },
    {
      id: '12345HY54345U76',
      type: 'Credit',
      date: '24th Dec 2024',
      amount: 50000,
      description: 'November Salary',
      from: 'Homesafe',
    },
  ];

  return (
    <div className="rounded-lg border-gray-200">
      <div className="flex items-center mb-1">
        <h1 className="text-[20px] font-semibold text-[#24292E]">Salary</h1>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[16px] text-[#24292E] font-semibold mt-[1rem]">
          Transaction History
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="py-3 px-2 bg-[#A5EA91]">Transaction Type</th>
              <th className="py-3 px-2 bg-[#A5EA91]">Transaction ID</th>
              <th className="py-3 px-2 bg-[#A5EA91]">Date</th>
              <th className="py-3 px-2 bg-[#A5EA91]">Amount</th>
              <th className="py-3 px-2 bg-[#A5EA91]">Description</th>
              <th className="py-3 px-2 bg-[#A5EA91]">From</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-2">{transaction.type}</td>
                <td className="py-3 px-2">{transaction.id}</td>
                <td className="py-3 px-2">{transaction.date}</td>
                <td className="py-3 px-2">
                  ₦ {transaction.amount.toLocaleString()}
                </td>
                <td className="py-3 px-2">{transaction.description}</td>
                <td className="py-3 px-2">{transaction.from}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Salary;
