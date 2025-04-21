import React from 'react';
import { FaFacebook } from 'react-icons/fa';
import { AiFillGoogleCircle, AiFillTwitterCircle } from 'react-icons/ai';
import HomesafeLogo from '../../../assets/images/Homesafe2.svg';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#123628] text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <img src={HomesafeLogo} alt="Homesafe logo" />
            </div>
            <p className="text-sm text-gray-300 mb-6">
              A service & transaction in which no physical goods are transferred
              from the seller to the buyer; the benefits of such a service are.
            </p>

            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-gray-300">
                <FaFacebook />
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <AiFillTwitterCircle />
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <AiFillGoogleCircle />
              </a>
            </div>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  Hire Artisans
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-medium mb-4">Get Update Newsletter</h3>
            <p className="text-sm text-gray-300 mb-4">
              Subscribe to get the latest news from us.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Email"
                className="px-4 py-2 w-full rounded-l-md text-gray-800 focus:outline-none bg-[#F9F5F5]"
              />
              <button
                type="submit"
                className="bg-gray-100 text-gray-800 px-4 rounded-r-md hover:bg-white transition-colors"
              >
                →
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="w-full h-[1px] bg-[#DFE1E3] mt-[3rem]"></div>
      <p className="text-[13px] text-[#F6F6F6] mt-[1rem] max-w-6xl mx-auto">
        Copyright@2025
      </p>
    </footer>
  );
};

export default Footer;
