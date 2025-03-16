import React from 'react';
import { FaUser, FaStar, FaRegStar } from 'react-icons/fa';

interface StaffMember {
  name: string;
  location: string;
  position: string;
  age: string;
  rating: number;
}

const StaffPage: React.FC = () => {
  const staffMembers: StaffMember[] = [
    {
      name: 'Cali Foster Jenkins',
      location: 'Oregon, Lagos',
      position: 'Chef/Cleaner',
      age: '23 yrs old',
      rating: 4
    },
    {
      name: 'Cali Foster Jenkins',
      location: 'Oregon, Lagos',
      position: 'Chef/Cleaner',
      age: '23 yrs old',
      rating: 4
    },
    {
      name: 'Cali Foster Jenkins',
      location: 'Oregon, Lagos',
      position: 'Chef/Cleaner',
      age: '23 yrs old',
      rating: 4
    },
  ];

  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="rounded-lg w-full mx-auto shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">My Staff</h1>
        <p className="text-gray-600 mt-2">Here are the names of your staff</p>
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        <div className="grid grid-cols-5 bg-[#C8EDDF80] px-4 h-[56px] flex items-center text-sm font-medium text-gray-600">
          <div>Employee Name</div>
          <div>State</div>
          <div>Position</div>
          <div>Age</div>
          <div>Ratings</div>
        </div>

        {staffMembers.map((member, index) => (
          <div 
            key={index} 
            className="grid grid-cols-5 items-center px-4 h-[56px] mb-2 last:mb-0 bg-white"
          >
            <div className="flex items-center gap-2 relative">
              <div className="bg-gray-200 rounded-full p-2 flex items-center justify-center relative">
                <FaUser className="text-white" />
                <div className="absolute w-3 h-3 bg-green-500 rounded-full -top-1 -right-1 border-2 border-white" />
              </div>
              <span>{member.name}</span>
            </div>
            <div>{member.location}</div>
            <div>{member.position}</div>
            <div>{member.age}</div>
            <div className="flex justify-between items-center">
              {renderRatingStars(member.rating)}
              <button className="bg-green-200 text-green-800 px-3 py-1 rounded-md text-sm">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffPage;