import React, { useState, useEffect, useRef } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaRegUser } from 'react-icons/fa';
import agentApi from '../../api/agentApi';

interface Employee {
  id: number;
  candidate: string;
  title: string;
  email: string;
  avatar: string;
  date: string;
  placement: string;
  gender: string;
  phone: string;
  status: string;
}

const CandidateTracker = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOptionsFor, setShowOptionsFor] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const response = await agentApi.getTrackedEmployees();
        if (response.status) {
          setEmployees(response.data);
        } else {
          setError(response.message || 'Failed to fetch employees');
        }
      } catch (err: any) {
        setError('Error fetching employees');
        console.error('Error fetching employees:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowOptionsFor(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOptions = (id: number) => {
    if (showOptionsFor === id) {
      setShowOptionsFor(null);
    } else {
      setShowOptionsFor(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-0">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Track</h2>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 sm:mt-[2rem] gap-2">
        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Here are all your candidates</p>
        <div className="text-xs sm:text-sm text-gray-600">
          <span
            className="cursor-pointer hover:text-green-700"
            onClick={() => navigate('/agent/all-candidates')}
          >
            View All
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>
      )}

      <div className="rounded-lg overflow-hidden pb-12 sm:pb-20">
        {/* Header section with green background */}

        <div className="overflow-x-auto overflow-y-visible" style={{ marginLeft: '-1rem', marginRight: '-1rem' }}>
          <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
            <table className="w-full" style={{ minWidth: '700px' }}>
              <thead>
                <tr className="bg-[#C8EDDF80] text-[#174B35] text-sm">
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Candidate</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Date</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Placement</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Gender</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                    Phone Number
                  </th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-left font-medium w-12 whitespace-nowrap"></th>
                </tr>
              </thead>
            <tbody className="">
              {isLoading ? (
                // Loading state - show skeleton rows
                [...Array(3)].map((_, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 animate-pulse"
                  >
                    <td className="px-4 py-3">
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : employees.length === 0 ? (
                // Empty state
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-3 text-center text-gray-500"
                  >
                    No candidates found
                  </td>
                </tr>
              ) : (
                // Data loaded successfully
                employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 flex items-center gap-3 whitespace-nowrap">
                      {employee.avatar ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden relative">
                          <img
                            src={employee.avatar}
                            alt={employee.candidate}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute w-3 h-3 bg-green-500 rounded-full -top-1 -right-1 border-2 border-white" />
                        </div>
                      ) : (
                        <div className="bg-gray-200 rounded-full p-2 flex items-center justify-center relative">
                          <FaUser className="text-white" />
                          <div className="absolute w-3 h-3 bg-green-500 rounded-full -top-1 -right-1 border-2 border-white" />
                        </div>
                      )}
                      <span>{employee.candidate}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {new Date(employee.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`${
                          employee.placement.toLowerCase() ===
                          'no employer assigned'
                            ? 'text-gray-500 italic'
                            : 'text-gray-700'
                        }`}
                      >
                        {employee.placement.toLowerCase() ===
                        'no employer assigned'
                          ? 'Not on placement'
                          : employee.placement}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {employee.gender.charAt(0).toUpperCase() +
                        employee.gender.slice(1)}
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {employee.phone}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        className={`px-3 py-1 rounded-full text-[13px] ${
                          employee.status.toLowerCase().includes('not') ||
                          employee.status.toLowerCase() === 'unverified'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {employee.status.toLowerCase().includes('not')
                          ? 'Unverified'
                          : 'Verified'}
                      </button>
                    </td>
                    <td className="px-4 py-3 relative">
                      <div
                        ref={
                          showOptionsFor === employee.id ? dropdownRef : null
                        }
                      >
                        <button
                          onClick={() => toggleOptions(employee.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <BsThreeDotsVertical />
                        </button>

                        {showOptionsFor === employee.id && (
                          <div className="absolute right-0 top-8 bg-white shadow-lg rounded-md py-2 w-48 z-50 border border-gray-200 min-w-max">
                            <div
                              className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                navigate(
                                  `/agent/candidate-profile/${employee.id}`
                                );
                                setShowOptionsFor(null);
                              }}
                            >
                              <FaRegUser className="text-gray-500" />
                              <span>View Profile</span>
                            </div>
                            {/* <div className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer">
                              <RiDeleteBin6Line className="text-gray-500" />
                              <span>Remove</span>
                            </div> */}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateTracker;
