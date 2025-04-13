import React from 'react';
import { FiSearch, FiDownload } from 'react-icons/fi';
import ContractImg from '../../assets/images/Contract.png';

interface ContractCardProps {
  name: string;
  description: string;
  imageUrl: string;
}

const ContractCard: React.FC<ContractCardProps> = ({
  name,
  description,
  imageUrl,
}) => {
  return (
    <div className="bg-white p-4 rounded-md border border-gray-100">
      <div className="mb-3">
        <img
          src={imageUrl}
          alt="Contract document"
          className="w-full h-[174px] object-cover rounded-sm"
        />
      </div>
      <h3 className="font-semibold text-[16px] text-[#24292E] mb-2">{name}</h3>
      <p className="text-[13px] text-[#48525B] mb-3">{description}</p>
      <button className="flex items-center justify-center rounded-[6px] text-[#6C7A89] text-xs border border-[#DCDEE5] w-[98px] h-[32px]">
        <FiDownload className="mr-1 text-black" size={14} />
        Download
      </button>
    </div>
  );
};

interface ContractsPageProps {
  title?: string;
}

const ContractsPage: React.FC<ContractsPageProps> = ({
  title = 'All Contracts',
}) => {
  const contractsData = [
    {
      id: 1,
      name: 'Cali Foster Jenkins',
      description: 'Here is the contract with Cali Foster Jenkins.',
      imageUrl: ContractImg,
    },
    {
      id: 2,
      name: 'Cali Foster Jenkins',
      description: 'Here is the contract with Cali Foster Jenkins.',
      imageUrl: ContractImg,
    },
    {
      id: 3,
      name: 'Cali Foster Jenkins',
      description: 'Here is the contract with Cali Foster Jenkins.',
      imageUrl: ContractImg,
    },
    {
      id: 4,
      name: 'Cali Foster Jenkins',
      description: 'Here is the contract with Cali Foster Jenkins.',
      imageUrl: ContractImg,
    },
  ];

  return (
    <div className=" rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#24292E]">{title}</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by date, staff name"
            className="pl-8 pr-4 py-2 border border-gray-100 rounded-[16px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-[480px]"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {contractsData.map((contract) => (
          <ContractCard
            key={contract.id}
            name={contract.name}
            description={contract.description}
            imageUrl={contract.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default ContractsPage;
