import React from 'react';
import AgentsImg from '../../../assets/images/Agents.png';

const Agents: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto mt-16 bg-white rounded-lg p-8">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-2/3 pr-6">
          <h3 className="text-[40px] font-semibold text-[#24292E]">
            <span className="font-semibold text-[#246D51]">Agents</span> are
            welcome here
          </h3>
          <p className="text-[#48525B] text-[24px] w-[523px] mt-3">
            Our agents help match you with skilled artisans for every job.
          </p>

          <button className="mt-6 bg-[#A5EA91] hover:bg-green-500 text-[#24292E] w-[201px] h-[51px] font-medium flex justify-center items-center rounded-md text-base transition-colors text-[20px]">
            Get Started
          </button>
        </div>

        <div className="md:w-1/3 mt-6 md:mt-0">
          <img
            src={AgentsImg}
            alt="Professional agent smiling"
            className="w-full max-w-xs rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Agents;
