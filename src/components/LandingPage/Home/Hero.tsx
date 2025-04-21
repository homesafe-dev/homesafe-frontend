import React from 'react';
import HeroImage from '../../../assets/images/Hero.jpeg';
import HomesafeLogo from '../../../assets/images/Homesafe2.svg';

const Hero: React.FC = () => {
  const pathname = window.location.pathname;

  return (
    <div className="relative w-full">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HeroImage}
          alt="Bright living room"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1D2125CC] opacity-80"></div>
      </div>

      {/* Navigation Bar */}
      <header className="relative z-10 px-[5%] py-4 flex justify-between items-center pt-8">
        <div className="flex items-center">
          <img src={HomesafeLogo} alt="Homesafe logo" />
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-[20px]">
          <a
            href="/home"
            className={`transition-colors ${pathname === '/home' ? 'text-[#A5EA91]' : 'text-white hover:text-gray-200'}`}
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
            className={`transition-colors ${pathname === '/support' ? 'text-[#174B35]' : 'text-white hover:text-gray-200'}`}
          >
            Support
          </a>
        </nav>
        <a href="/employer/login">
          {' '}
          <button className="bg-[#A5EA91] hover:bg-green-500 text-[#24292E] font-medium py-2 px-4 rounded-md transition-colors">
            Sign-in
          </button>
        </a>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 md:py-32">
        <h2 className="text-[56px] md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl leading-tight">
          Welcome to HomeSafe: Your Best Source for Skilled Artisans
        </h2>

        <p className="text-[32px] md:text-2xl text-white mb-12 max-w-2xl">
          Find and hire skilled professionals for your home maintenance and
          essential services.
        </p>

        <button className="bg-[#A5EA91] hover:bg-green-500 text-[#24292E] font-semibold py-3 px-8 rounded-md text-lg transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Hero;
