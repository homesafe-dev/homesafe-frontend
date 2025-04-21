import React,{useState} from 'react';
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
    <div className="py-8 px-4 md:px-6 pb-[10rem]">
      <h1 className="text-center text-[40px] font-semibold mb-8 mt-[1rem]">
        List of <span className="text-[#246D51]">Employees</span>
      </h1>

      <div className="relative mb-6 w-[562px] h-[42px] max-w-md mx-auto">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by role, location or skills"
              className="w-full pl-10 pr-4 py-2 border border-gray-100 rounded-[16px] text-[16px] text-[#5A6672] focus:outline-none focus:ring-1 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white rounded-lg p-6 shadow-sm flex flex-col items-center"
          >
            <div className="mb-4 relative">
              <img
                src={employee.imageUrl}
                alt={employee.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div
                className={`absolute top-0 right-0 w-4 h-4 border-2 border-white rounded-full ${
                  employee.isOnline ? 'bg-[#37A379]' : 'bg-gray-400'
                }`}
              />
            </div>
            <h3 className="font-medium text-[16px] text-[#24292E] mb-2">
              {employee.name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              {employee.location} | {employee.age} yrs old
            </p>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs mb-3">
              {employee.profession}
            </div>
            <div className="flex mb-4">{renderStars(employee.rating)}</div>
            <button className="w-full bg-[#A5EA91] hover:bg-green-300 text-[#24292E] px-4 py-2 rounded-md text-sm transition-colors">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;