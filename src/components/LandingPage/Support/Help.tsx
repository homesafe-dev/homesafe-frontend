import React from 'react';
import Phone from '../../../assets/icons/phone.svg';
import Mail from '../../../assets/icons/mail.svg';

const Help: React.FC = () => {
  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-[40px] font-bold text-[#39302A] text-center mb-16">
          Need Help?
        </h2>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-16">
          <div className="flex flex-col text-left shadow-sm w-[70%] py-[2rem] px-[1rem]">
           <img src={Phone} alt="phone" className='w-[67px] h-[67px]'/>
            <h3 className="text-[24px] font-medium text-gray-700 mb-2">Talk to Support</h3>
            <p className="text-[24px] text-gray-600">+234 701 2345 678</p>
          </div>

          <div className="flex flex-col text-left shadow-sm w-[70%] py-[2rem] px-[1rem]">
          <img src={Mail} alt="phone" className='w-[67px] h-[67px]'/>
            <h3 className="text-[24px] font-semibold text-gray-700 mb-2">Email Support</h3>
            <p className="text-[24px] text-gray-600">homesafe@email.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;