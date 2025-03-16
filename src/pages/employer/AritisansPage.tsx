import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import ArtisanImg from '../../assets/images/artisans.png'
import { Link } from 'react-router-dom';

interface Artisan {
  id: number;
  name: string;
  location: string;
  age: number;
  profession: string;
  rating: number;
  imageUrl: string;
  isOnline: boolean;
}

const ArtisansPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample artisans data
  const artisans: Artisan[] = [
    {
      id: 1,
      name: 'Cali Foster Jenkins',
      location: 'Lagos',
      age: 23,
      profession: 'Chef',
      rating: 4,
      imageUrl: ArtisanImg,
      isOnline: true,
    },
    {
      id: 2,
      name: 'Cali Foster Jenkins',
      location: 'Lagos',
      age: 23,
      profession: 'Chef',
      rating: 4,
      imageUrl: ArtisanImg,
      isOnline: false,
    },
    {
      id: 3,
      name: 'Cali Foster Jenkins',
      location: 'Lagos',
      age: 23,
      profession: 'Chef',
      rating: 4,
      imageUrl: ArtisanImg,
      isOnline: true,
    },
    {
      id: 4,
      name: 'Cali Foster Jenkins',
      location: 'Lagos',
      age: 23,
      profession: 'Chef',
      rating: 4,
      imageUrl: ArtisanImg,
      isOnline: false,
    },
    {
      id: 5,
      name: 'Cali Foster Jenkins',
      location: 'Lagos',
      age: 23,
      profession: 'Chef',
      rating: 4,
      imageUrl: ArtisanImg,
      isOnline: true,
    },
    {
      id: 6,
      name: 'Cali Foster Jenkins',
      location: 'Lagos',
      age: 23,
      profession: 'Chef',
      rating: 4,
      imageUrl: ArtisanImg,
      isOnline: false,
    },
  ];

  // Render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-yellow-400 text-lg ${i <= rating ? 'opacity-100' : 'opacity-30'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen">

      {/* Main Content */}
      <div className="px-6 py-6">
        <div className='flex justify-between'>
        <h1 className="text-xl font-semibold text-[#24292E] mb-4">Artisans</h1>
        
        {/* Search Bar */}
        <div className="relative mb-6 w-[335px] h-[42px] max-w-md ml-auto">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by role, location or skills"
            className="w-full pl-10 pr-4 py-2 border rounded-md text-[16px] text-[#5A6672] focus:outline-none focus:ring-1 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        </div>

        <p className="text-[13px] text-[#24292E] mb-6">List of available artisans</p>

        {/* Artisans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          {artisans.map((artisan) => (
            <div key={artisan.id} className="flex flex-col items-center bg-white p-8 shadow">
              <div className="mb-3 relative">
                <img
                  src={artisan.imageUrl}
                  alt={artisan.name}
                  className="w-24 h-24 rounded-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
                  }}
                />
                <div 
                  className={`absolute top-1 right-1 w-4 h-4 border-2 border-white rounded-full ${
                    artisan.isOnline ? 'bg-[#37A379]' : 'bg-gray-400'
                  }`}
                />
              </div>
              <h3 className="font-medium text-center text-[16px] text-[#24292E] mt-[1rem]">{artisan.name}</h3>
              <p className="text-sm text-gray-500 mb-1 mt-[0.5rem]">
                {artisan.location} | {artisan.age} yrs old
              </p>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs mb-2 mt-[0.5rem]">
                {artisan.profession}
              </div>
              <div className="flex mb-3">
                {renderStars(artisan.rating)}
              </div>
              <Link to='/employer/artisan/profile' className='w-full'> <button className="bg-[#A5EA91] hover:bg-green-300 text-[#24292E] px-4 py-2 rounded-md text-sm transition-colors w-full text-center mt-[1rem] cursor-pointer">
                View Profile
              </button></Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtisansPage;