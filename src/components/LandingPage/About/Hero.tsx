import React, { useState } from 'react';
import HeroImage from '../../../assets/images/AboutImg.jpeg';
import HomesafeLogo from '../../../assets/images/Homesafe2.svg';

const Hero: React.FC = () => {
  const pathname = window.location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      <div className="absolute inset-0 z-0">
        <img
          src={HeroImage}
          alt="Bright living room"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1D2125CC] opacity-80"></div>
      </div>

      {/* Navigation Bar */}
      <header className="relative z-20 px-4 sm:px-[5%] py-4 flex justify-between items-center pt-4 sm:pt-8">
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
            className={`transition-colors ${pathname === '/' ? 'text-[#A5EA91]' : 'text-white hover:text-gray-200'}`}
          >
            Home
          </a>
          <a
            href="/about"
            className={`transition-colors ${pathname === '/about' ? 'text-[#A5EA91]' : 'text-white hover:text-gray-200'}`}
          >
            About Us
          </a>
          <a
            href="/artisans"
            className={`transition-colors ${pathname === '/artisans' ? 'text-[#A5EA91]' : 'text-white hover:text-gray-200'}`}
          >
            Hire Artisans
          </a>
          <a
            href="/support"
            className={`transition-colors ${pathname === '/support' ? 'text-[#A5EA91]' : 'text-white hover:text-gray-200'}`}
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
            className="text-white p-2"
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

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 backdrop-blur-sm bg-black/70 transition-opacity duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'opacity-100 z-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMenu}
      >
        <div
          className={`fixed top-0 left-0 w-full bg-[#1D2125] transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <img src={HomesafeLogo} alt="Homesafe logo" className="h-8" />
            <button
              onClick={toggleMenu}
              className="text-red-500 p-2 hover:text-red-600 transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col space-y-5 px-6 py-6">
            <a
              href="/"
              className={`text-xl font-medium transition-colors ${
                pathname === '/' ? 'text-[#A5EA91]' : 'text-white'
              }`}
              onClick={toggleMenu}
            >
              Home
            </a>
            <a
              href="/about"
              className={`text-xl font-medium transition-colors ${
                pathname === '/about' ? 'text-[#A5EA91]' : 'text-white'
              }`}
              onClick={toggleMenu}
            >
              About Us
            </a>
            <a
              href="/artisans"
              className={`text-xl font-medium transition-colors ${
                pathname === '/artisans' ? 'text-[#A5EA91]' : 'text-white'
              }`}
              onClick={toggleMenu}
            >
              Hire Artisans
            </a>
            <a
              href="/support"
              className={`text-xl font-medium transition-colors ${
                pathname === '/support' ? 'text-[#A5EA91]' : 'text-white'
              }`}
              onClick={toggleMenu}
            >
              Support
            </a>
            <div className="pt-2">
              <a
                href="/employer/login"
                className="sm:hidden block"
                onClick={toggleMenu}
              >
                <button className="bg-[#A5EA91] hover:bg-green-500 text-[#24292E] font-medium py-2.5 px-4 rounded-md transition-colors w-full">
                  Sign-in
                </button>
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex-grow flex items-center justify-center">
        <div className="text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white mb-4 sm:mb-6 leading-tight">
            HomeSafe, Comforts and confidentiality at your Fingertips
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl lg:text-[32px] text-white max-w-2xl mx-auto">
            Fill your Space, with people that feels safe
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
