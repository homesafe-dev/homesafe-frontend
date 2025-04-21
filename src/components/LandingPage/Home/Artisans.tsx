import React from 'react'
import ArtisanImg from '../../../assets/images/artisans.png';

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

const Artisans = () => {
  // Sample data based on the screenshot
  const recentArtisans: Artisan[] = [
    {
      id: 1,
      name: 'Tunde Olumuyiwa',
      location: 'Abuja',
      age: 29,
      profession: 'Chauffeur',
      rating: 4,
      imageUrl: ArtisanImg,
      isOnline: true,
    },
    {
      id: 2,
      name: 'Prisca Ukaegbu',
      location: 'Lagos',
      age: 24,
      profession: 'Chef',
      rating: 4,
      imageUrl: ArtisanImg,
      isOnline: true,
    },
    {
      id: 3,
      name: 'Omeiza Anakoju',
      location: 'Kogi',
      age: 31,
      profession: 'Gardener',
      rating: 5,
      imageUrl: ArtisanImg,
      isOnline: true,
    },
    {
      id: 4,
      name: 'Paula Wilson',
      location: 'Port Harcourt',
      age: 32,
      profession: 'Nanny',
      rating: 5,
      imageUrl: ArtisanImg,
      isOnline: true,
    },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-yellow-400 text-lg ${i <= rating ? 'opacity-100' : 'opacity-30'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="py-16 px-4 md:px-6">
      <h2 className="text-center text-[40px] font-medium mb-12 text-[#39302A]">
        Recently Hired <span className="text-[#246D51]">Artisans</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {recentArtisans.map((artisan) => (
          <div
            key={artisan.id}
            className="flex flex-col items-center bg-white p-8 shadow rounded-lg"
          >
            <div className="mb-3 relative">
              <img
                src={artisan.imageUrl}
                alt={artisan.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div
                className={`absolute top-1 right-1 w-4 h-4 border-2 border-white rounded-full ${
                  artisan.isOnline ? 'bg-[#37A379]' : 'bg-gray-400'
                }`}
              />
            </div>
            <h3 className="font-medium text-center text-[16px] text-[#24292E] mt-4">
              {artisan.name}
            </h3>
            <p className="text-sm text-gray-500 mb-1 mt-2">
              {artisan.location} | {artisan.age} yrs old
            </p>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs mb-2 mt-2">
              {artisan.profession}
            </div>
            <div className="flex mb-3">{renderStars(artisan.rating)}</div>
            <button className="bg-[#A5EA91] hover:bg-green-300 text-[#24292E] px-4 py-2 rounded-md text-sm transition-colors w-full text-center mt-4">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Artisans