import React, { useState } from 'react';
import HeroImage from '../../../assets/images/Support.jpeg';
import HomesafeLogo from '../../../assets/images/HomesafeLogo2.svg';

const Hero: React.FC = () => {
  const pathname = window.location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative w-full min-h-[80vh]">
      <div className="absolute inset-0 z-0">
        <img
          src={HeroImage}
          alt="Bright living room"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1D2125CC] opacity-80"></div>
      </div>

      <header className="relative z-10 px-4 sm:px-[5%] py-4 flex justify-between items-center pt-6 sm:pt-8 bg-white">
        <div className="flex items-center">
          <img
            src={HomesafeLogo}
            alt="Homesafe logo"
            className="w-32 sm:w-auto"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-lg lg:text-[20px]">
          <a
            href="/"
            className={`transition-colors ${pathname === '/' ? 'text-[#A5EA91]' : 'text-[#24292E] hover:text-gray-900'}`}
          >
            Home
          </a>
          <a
            href="/about"
            className={`transition-colors ${pathname === '/about' ? 'text-[#A5EA91]' : 'text-[#24292E] hover:text-gray-900'}`}
          >
            About Us
          </a>
          <a
            href="/artisans"
            className={`transition-colors ${pathname === '/artisans' ? 'text-[#A5EA91]' : 'text-[#24292E] hover:text-gray-900'}`}
          >
            Hire Artisans
          </a>
          <a
            href="/support"
            className={`transition-colors ${pathname === '/support' ? 'text-[#174B35]' : 'text-[#24292E] hover:text-gray-900'}`}
          >
            Support
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <a href="/employer/login" className="hidden sm:block">
            <button className="bg-[#A5EA91] hover:bg-green-500 text-[#24292E] font-medium py-2 px-4 rounded-md transition-colors text-sm">
              Sign-in
            </button>
          </a>
          <button
            onClick={toggleMenu}
            className="text-[#24292E] p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Desktop Sign-in Button */}
        <div className="hidden md:block">
          <a href="/employer/login">
            <button className="bg-[#A5EA91] hover:bg-green-500 text-[#24292E] font-medium py-2 px-4 rounded-md transition-colors">
              Sign-in
            </button>
          </a>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute z-20 w-full bg-white md:hidden">
          <nav className="flex flex-col space-y-4 px-4 py-6">
            <a
              href="/"
              className={`text-lg ${pathname === '/' ? 'text-[#A5EA91]' : 'text-[#24292E]'}`}
            >
              Home
            </a>
            <a
              href="/about"
              className={`text-lg ${pathname === '/about' ? 'text-[#A5EA91]' : 'text-[#24292E]'}`}
            >
              About Us
            </a>
            <a
              href="/artisans"
              className={`text-lg ${pathname === '/artisans' ? 'text-[#A5EA91]' : 'text-[#24292E]'}`}
            >
              Hire Artisans
            </a>
            <a
              href="/support"
              className={`text-lg ${pathname === '/support' ? 'text-[#174B35]' : 'text-[#24292E]'}`}
            >
              Support
            </a>
            <a href="/employer/login" className="sm:hidden">
              <button className="w-full bg-[#A5EA91] hover:bg-green-500 text-[#24292E] font-medium py-2 px-4 rounded-md transition-colors">
                Sign-in
              </button>
            </a>
          </nav>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 min-h-[calc(80vh-80px)] flex flex-col items-center justify-center">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-[280px] xs:max-w-[350px] sm:max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white mb-4 sm:mb-6 leading-tight">
              Need help? We're here for you every step of the way.
            </h2>

            <p className="text-lg sm:text-xl md:text-2xl lg:text-[32px] text-white mb-8 sm:mb-12 leading-relaxed">
              Providing outstanding services for your homes and offices.
              Ensuring quality, reliability, and excellence in every aspect of
              our support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
