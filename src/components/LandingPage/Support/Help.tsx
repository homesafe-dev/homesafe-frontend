import React from 'react';
import Phone from '../../../assets/icons/phone.svg';
import Mail from '../../../assets/icons/mail.svg';

const Help: React.FC = () => {
  return (
    <div className="bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-[#39302A] text-center mb-8 sm:mb-12 lg:mb-16">
          Need Help?
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 sm:gap-8 lg:gap-16">
          <div className="flex flex-col text-left bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 w-full md:w-1/2 p-6 sm:p-8">
            <div className="mb-4 sm:mb-6">
              <img
                src={Phone}
                alt="Phone icon"
                className="w-12 h-12 sm:w-[67px] sm:h-[67px]"
              />
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-[24px] font-medium text-gray-700 mb-2 sm:mb-3">
              Talk to Support
            </h3>
            <a
              href="tel:+2347012345678"
              className="text-lg sm:text-xl lg:text-[24px] text-gray-600 hover:text-green-600 transition-colors"
            >
              +234 701 2345 678
            </a>
          </div>

          <div className="flex flex-col text-left bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 w-full md:w-1/2 p-6 sm:p-8">
            <div className="mb-4 sm:mb-6">
              <img
                src={Mail}
                alt="Email icon"
                className="w-12 h-12 sm:w-[67px] sm:h-[67px]"
              />
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-[24px] font-medium text-gray-700 mb-2 sm:mb-3">
              Email Support
            </h3>
            <a
              href="mailto:homesafe@email.com"
              className="text-lg sm:text-xl lg:text-[24px] text-gray-600 hover:text-green-600 transition-colors"
            >
              homesafe@email.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
