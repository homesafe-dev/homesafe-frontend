import React, { useState } from 'react';
import { FiArrowLeft, FiCalendar } from 'react-icons/fi';
import ArtisanImg from '../../assets/images/artisans.png';

interface ArtisanProfileProps {
  goBack: () => void;
}

const ArtisanProfileView: React.FC<ArtisanProfileProps> = ({ goBack }) => {
  const [employmentStartDate, setEmploymentStartDate] = useState('');

  return (
    <div className=" min-h-screen">
      <div className="flex items-center mb-8">
        <button
          onClick={goBack}
          className="flex items-center text-semibold text-[20px] text-[#24292E] hover:text-gray-900"
        >
          <FiArrowLeft className="mr-2" />
          <span>Cali's Profile</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 bg-white shadow-sm p-8 rounded-[16px]">
        {/* Profile section */}
        <div className="w-full lg:w-1/2 border-r border-[#BDC2C7] p-6 flex flex-col items-center relative">
          <div className="relative mb-4">
            <img
              src={ArtisanImg}
              alt="Profile"
              className="rounded-full w-24 h-24 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://via.placeholder.com/100';
              }}
            />
            <div
              className={`absolute top-1 right-1 w-4 h-4 border-2 border-white rounded-full bg-[#37A379]`}
            />
          </div>

          <h2 className="text-[16px] text-gray-700 mt-[1rem] font-medium">
            Cali Foster Jenkins
          </h2>
          <p className="text-[13px] mt-[0.5rem] text-[#24292E] mb-2">
            Lagos | 23 yrs old
          </p>

          <div className="bg-[#C8EDDF80] mt-[0.5rem] text-[#48525B] w-[64px] h-[26px] flex items-center justify-center px-3 py-1 rounded-[8px] text-[13px] mb-2">
            Chef
          </div>

          <div className="flex mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-yellow-400 mt-[0.5rem] ${star <= 4 ? 'opacity-100' : 'opacity-30'}`}
              >
                ★
              </span>
            ))}
          </div>

          <div className="mb-6 w-full">
            <h3 className="text-[#246D51] text-[16px] font-semibold mb-2">
              About me
            </h3>
            <p className="text-[13px] text-[#48525B]">
              Meet Cali Foster, a passionate chef from Lagos State, Nigeria.
              With a love for cooking that knows no bounds, Cali brings the
              flavors of Lagos to every dish. From traditional Nigerian cuisine
              to innovative fusion dishes, this Lagos-born chef is dedicated to
              sharing the rich culinary heritage of his hometown with the world.
            </p>
          </div>
        </div>

        {/* Employment Form */}
        <div className="w-full lg:w-1/2 ">
          <h3 className="text-[#246D51] text-[16px] font-semibold mb-6">
            Employment Form
          </h3>

          <div className="space-y-6 border border-gray-100 p-8 rounded-[16px]">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Employment Start Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="MM/DD/YYYY"
                  className="w-full border h-[50px] border-gray-100 rounded p-3 pr-10 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  value={employmentStartDate}
                  onChange={(e) => setEmploymentStartDate(e.target.value)}
                />
                <FiCalendar className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ml-auto w-[143px]">
        <button className="bg-[#A5EA91] hover:bg-green-500 text-green-800 py-2 rounded-md text-sm  ml-auto mt-[1rem] transition-colors w-[143px] h-[42px">
          Hire Me
        </button>
      </div>
    </div>
  );
};

export default ArtisanProfileView;
