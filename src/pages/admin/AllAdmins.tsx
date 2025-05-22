import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

interface Admin {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  status: string;
  avatar?: string;
}

const AllAdmins: React.FC = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showOptionsFor, setShowOptionsFor] = useState<number | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, [currentPage]);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      // const response = await adminSettingsApi.getAdmins(currentPage);

      // For now, using mock data
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

      const mockAdmins: Admin[] = Array(10)
        .fill(null)
        .map((_, index) => ({
          id: index + 1,
          full_name: 'Naomi Abiodun John',
          email: 'name@email.com',
          phone_number: '07012345678',
          date_of_birth: '24th Dec 1990',
          gender: 'Female',
          status: 'Verified',
        }));

      setAdmins(mockAdmins);
      setTotalPages(3); // Mock total pages
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch admins');
      setIsLoading(false);
      console.error('Error fetching admins:', err);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const toggleOptions = (id: number) => {
    if (showOptionsFor === id) {
      setShowOptionsFor(null);
    } else {
      setShowOptionsFor(id);
    }
  };

  const handleRemoveAdmin = async (adminId: number) => {
    try {
      // In a real app, this would be an API call
      // await adminSettingsApi.deleteAdmin(adminId);

      // For now, just update the UI
      setAdmins(admins.filter((admin) => admin.id !== adminId));
      setShowOptionsFor(null);
    } catch (err) {
      setError('Failed to remove admin');
      console.error('Error removing admin:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-6">
        <button
          className="flex items-center text-gray-600 hover:text-gray-800"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" />
          <span className="text-gray-800">Admin</span>
        </button>
      </div>

      {/* Header with Create New Admin button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">All Admins</h1>
        <button
          onClick={() => navigate('/admin/create-admin')}
          className="px-4 py-2 bg-[#A5EA91] text-[#174B35] rounded-md flex items-center"
        >
          <span className="mr-1">+</span> Create New Admin
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Admins Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : admins.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-700 bg-[#C8EDDF80]">
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Date of Birth</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr
                  key={admin.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 overflow-hidden">
                      {admin.avatar ? (
                        <img
                          src={admin.avatar}
                          alt={admin.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          {admin.full_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    {admin.full_name}
                  </td>
                  <td className="py-3 px-4">{admin.email}</td>
                  <td className="py-3 px-4">{admin.phone_number}</td>
                  <td className="py-3 px-4">{admin.date_of_birth}</td>
                  <td className="py-3 px-4">{admin.gender}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      {admin.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 relative">
                    <button
                      onClick={() => toggleOptions(admin.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <BsThreeDotsVertical />
                    </button>

                    {showOptionsFor === admin.id && (
                      <div className="absolute right-8 top-10 bg-white shadow-lg rounded-md py-2 w-48 z-10">
                        <div
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleRemoveAdmin(admin.id)}
                        >
                          Remove
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-gray-100 rounded-full p-8 mb-4">
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="60" height="60" rx="30" fill="#F5F5F5" />
              <path d="M20 20H40V40H20V20Z" fill="#D9D9D9" />
              <path d="M25 25H35V30H25V25Z" fill="#BDBDBD" />
              <path d="M25 32H35V35H25V32Z" fill="#BDBDBD" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            Nothing Here
          </h3>
          <p className="text-gray-500">You don't have a review yet</p>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && admins.length > 0 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentPage === pageNum ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            )
          )}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default AllAdmins;
