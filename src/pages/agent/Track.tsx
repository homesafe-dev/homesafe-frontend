import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa";


const CandidateTracker = () => {
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: 'Naomi Abiodun John',
      date: '24th Dec 2024',
      placement: 'Mr Akumyili, Lagos',
      gender: 'Female',
      phone: '07012345678',
      status: 'Verified',
      showOptions: false
    },
    // Duplicate entries for the demonstration
    {
      id: 2,
      name: 'Naomi Abiodun John',
      date: '24th Dec 2024',
      placement: 'Mr Akumyili, Lagos',
      gender: 'Female',
      phone: '07012345678',
      status: 'Verified',
      showOptions: false
    },
    {
      id: 3,
      name: 'Naomi Abiodun John',
      date: '24th Dec 2024',
      placement: 'Mr Akumyili, Lagos',
      gender: 'Female',
      phone: '07012345678',
      status: 'Verified',
      showOptions: false
    },
    {
      id: 4,
      name: 'Naomi Abiodun John',
      date: '24th Dec 2024',
      placement: 'Mr Akumyili, Lagos',
      gender: 'Female',
      phone: '07012345678',
      status: 'Verified',
      showOptions: false
    },
    {
      id: 5,
      name: 'Naomi Abiodun John',
      date: '24th Dec 2024',
      placement: 'Mr Akumyili, Lagos',
      gender: 'Female',
      phone: '07012345678',
      status: 'Verified',
      showOptions: false
    },
    {
      id: 6,
      name: 'Naomi Abiodun John',
      date: '24th Dec 2024',
      placement: 'Mr Akumyili, Lagos',
      gender: 'Female', 
      phone: '07012345678',
      status: 'Verified',
      showOptions: false
    },
    {
      id: 7,
      name: 'Naomi Abiodun John',
      date: '24th Dec 2024',
      placement: 'Mr Akumyili, Lagos',
      gender: 'Female',
      phone: '07012345678',
      status: 'Verified',
      showOptions: false
    },
    {
      id: 8,
      name: 'Naomi Abiodun John',
      date: '24th Dec 2024',
      placement: 'Mr Akumyili, Lagos',
      gender: 'Female',
      phone: '07012345678',
      status: 'Verified',
      showOptions: false
    },
    {
      id: 9,
      name: 'Naomi Abiodun John',
      date: '24th Dec 2024',
      placement: 'Mr Akumyili, Lagos',
      gender: 'Female',
      phone: '07012345678',
      status: 'Verified',
      showOptions: false
    }
  ]);

  const [showOptionsFor, setShowOptionsFor] = useState(null);

  const toggleOptions = (id) => {
    if (showOptionsFor === id) {
      setShowOptionsFor(null);
    } else {
      setShowOptionsFor(id);
    }
  };

  return (
    <div className=" max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Track</h2>
      <div className='flex justify-between items-center mt-[2rem]'>
      <p className="text-gray-600 mb-6">Here are all your candidates</p>
      <div className="text-sm text-gray-600">
            <span className="cursor-pointer hover:text-green-700">View All</span>
          </div>
          </div>
      <div className="rounded-lg overflow-hidden">
        {/* Header section with green background */}
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#C8EDDF80] text-[#174B35] text-sm">
                <th className="px-4 py-3 text-left font-medium">New Candidate</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Placement</th>
                <th className="px-4 py-3 text-left font-medium">Gender</th>
                <th className="px-4 py-3 text-left font-medium">Phone Number</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium w-12"></th>
              </tr>
            </thead>
            <tbody className="">
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 flex items-center gap-3">
                  <div className="bg-gray-200 rounded-full p-2 flex items-center justify-center relative">
                <FaUser className="text-white" />
                <div className="absolute w-3 h-3 bg-green-500 rounded-full -top-1 -right-1 border-2 border-white" />
              </div>
                    <span>{candidate.name}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{candidate.date}</td>
                  <td className="px-4 py-3 text-gray-700">{candidate.placement}</td>
                  <td className="px-4 py-3 text-gray-700">{candidate.gender}</td>
                  <td className="px-4 py-3 text-gray-700">{candidate.phone}</td>
                  <td className="px-4 py-3">
                    <button className="text-[#246D51] bg-[#EEFFF9] w-[81px] h-[26px]">{candidate.status}</button>
                  </td>
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() => toggleOptions(candidate.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <BsThreeDotsVertical />
                    </button>
                    
                    {showOptionsFor === candidate.id && (
                      <div className="absolute right-8 top-10 bg-white shadow-lg rounded-md py-2 w-48 z-10">
                       <Link to="/employer/staff/profile"><div className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer">
                          <FaRegUser className="text-gray-500" />
                          <span>View Profile</span>
                        </div></Link> 
                        <div className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer">
                          <RiDeleteBin6Line className="text-gray-500" />
                          <span>Remove</span>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CandidateTracker;