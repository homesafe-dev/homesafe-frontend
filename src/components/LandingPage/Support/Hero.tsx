import React from 'react';
import HeroImage from '../../../assets/images/Support.jpeg';
import HomesafeLogo from '../../../assets/images/HomesafeLogo2.svg';

const Hero: React.FC = () => {
  const pathname = window.location.pathname;

  return (
    <div className="relative w-full">
      <div className="absolute inset-0 z-0">
        <img 
          src={HeroImage} 
          alt="Bright living room" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1D2125CC] opacity-80"></div>
      </div>

      <header className="relative z-10 px-[5%] py-4 flex justify-between items-center pt-8 bg-white">
        <div className="flex items-center">
          <img src={HomesafeLogo} alt='Homesafe logo'/>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8 text-[20px]">
          <a 
            href="/home" 
            className={`transition-colors ${pathname === '/home' ? 'text-[#A5EA91]' : 'text-[#24292E] hover:text-gray-900'}`}
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
        <button className="bg-[#A5EA91] hover:bg-green-500 text-[#24292E] font-medium py-2 px-4 rounded-md transition-colors">
            Sign-in
        </button>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 md:py-45">
        <h2 className="text-[56px] md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl leading-tight">
        Need help? We're here for you every step of the way.
        </h2>
        
        <p className="text-[32px] md:text-2xl text-white mb-12 max-w-5xl">
        Providing outstanding services for your homes and offices.Providing outstanding services for your homes and offices.Providing outstanding services for your homes and offices.Providing outstanding services for your homes and offices.Providing outstanding services for your homes and offices.
        </p>
        
      </div>
    </div>
  );
};

export default Hero;