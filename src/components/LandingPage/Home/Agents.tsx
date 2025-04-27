import React from 'react';
import AgentsImg from '../../../assets/images/Agents.png';

const Agents: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto mt-8 sm:mt-16 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg p-4 sm:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl lg:text-[40px] font-semibold text-[#24292E]">
              <span className="font-semibold text-[#246D51]">Agents</span> are
              welcome here
            </h3>
            <p className="text-[#48525B] text-lg sm:text-xl lg:text-2xl mt-2 sm:mt-3 max-w-xl">
              Our agents help match you with skilled artisans for every job.
            </p>

            <button className="mt-4 sm:mt-6 bg-[#A5EA91] hover:bg-green-500 text-[#24292E] px-6 py-3 font-medium rounded-md text-base sm:text-lg lg:text-xl transition-colors w-full sm:w-auto">
              Get Started
            </button>
          </div>

          <div className="w-full md:w-1/3 max-w-sm">
            <img
              src={AgentsImg}
              alt="Professional agent smiling"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agents;
