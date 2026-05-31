import React, { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import ArtisanImg from '../../../assets/images/artisans.png';
import { FiSearch } from 'react-icons/fi';

interface Employee {
  id: number;
  name: string;
  location: string;
  age: number;
  profession: string;
  rating: number;
  imageUrl: string;
  isOnline: boolean;
}

const EmployeeList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const employees: Employee[] = [
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
      isOnline: true,
    },
    {
      id: 3,
      name: 'Cali Foster Jenkins',
      location: 'Lagos',
      age: 23,
      profession: 'Chef',
      rating: 4,
      imageUrl: ArtisanImg,
      isOnline: false,
    },
    {
      id: 4,
      name: 'Cali Foster Jenkins',
      location: 'Lagos',
      age: 23,
      profession: 'Chef',
      rating: 4,
      imageUrl: ArtisanImg,
      isOnline: true,
    },
    {
      id: 5,
      name: 'Cali Foster Jenkins',
      location: 'Lagos',
      age: 23,
      profession: 'Chef',
      rating: 4,
      imageUrl: ArtisanImg,
      isOnline: false,
    },
    {
      id: 6,
      name: 'Cali Foster Jenkins',
      location: 'Lagos',
      age: 23,
      profession: 'Chef',
      rating: 4,
      imageUrl: ArtisanImg,
      isOnline: true,
    },
    {
      id: 7,
      name: 'Cali Foster Jenkins',
      location: 'Lagos',
      age: 23,
      profession: 'Chef',
      rating: 4,
      imageUrl: ArtisanImg,
      isOnline: true,
    },
    {
      id: 8,
      name: 'Cali Foster Jenkins',
      location: 'Lagos',
      age: 23,
      profession: 'Chef',
      rating: 4,
      imageUrl: ArtisanImg,
      isOnline: false,
    },
    {
      id: 9,
      name: 'Cali Foster Jenkins',
      location: 'Lagos',
      age: 23,
      profession: 'Chef',
      rating: 4,
      imageUrl: ArtisanImg,
      isOnline: true,
    },
    {
      id: 10,
      name: 'Cali Foster Jenkins',
      location: 'Lagos',
      age: 23,
      profession: 'Chef',
      rating: 4,
      imageUrl: ArtisanImg,
      isOnline: true,
    },
    {
      id: 11,
      name: 'Cali Foster Jenkins',
      location: 'Lagos',
      age: 23,
      profession: 'Chef',
      rating: 4,
      imageUrl: ArtisanImg,
      isOnline: false,
    },
    {
      id: 12,
      name: 'Cali Foster Jenkins',
      location: 'Lagos',
      age: 23,
      profession: 'Chef',
      rating: 4,
      imageUrl: ArtisanImg,
      isOnline: true,
    },
  ];

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <AiFillStar
          key={i}
          className={`text-lg ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pb-[10rem]">
      <h1 className="text-center text-2xl sm:text-3xl lg:text-[40px] font-semibold mb-6 sm:mb-8 mt-4 sm:mt-[1rem]">
        List of <span className="text-[#246D51]">Employees</span>
      </h1>

      <div className="relative mb-6 sm:mb-8 w-full max-w-[562px] mx-auto">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by role, location or skills"
          className="w-full h-[42px] pl-10 pr-4 py-2 border border-border-default rounded-[16px] text-[16px] text-[#5A6672] focus:outline-none focus:ring-1 focus:ring-green-500 transition-shadow hover:shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
          >
            <div className="mb-4 relative">
              <img
                src={employee.imageUrl}
                alt={employee.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
              />
              <div
                className={`absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-2 border-white rounded-full ${
                  employee.isOnline ? 'bg-[#37A379]' : 'bg-gray-400'
                }`}
              />
            </div>
            <h3 className="font-medium text-[15px] sm:text-[16px] text-[#24292E] mb-2 text-center">
              {employee.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-2 text-center">
              {employee.location} | {employee.age} yrs old
            </p>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs mb-3">
              {employee.profession}
            </div>
            <div className="flex mb-4 gap-0.5">
              {renderStars(employee.rating)}
            </div>
            <button className="w-full bg-[#A5EA91] hover:bg-green-300 text-[#24292E] px-4 py-2 rounded-md text-sm transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
              View Profile
            </button>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">
            No employees found matching your search.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
