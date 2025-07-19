import React, { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import CreateUserModal from '../../components/CreateUserModal';
import adminApi from '../../api/adminApi';
import adminSettingsApi from '../../api/adminSettingsApi';
import { format } from 'date-fns';

interface Admin {
  id: number;
  first_name: string;
  last_name: string;
  title?: string;
  username?: string;
  email: string;
  email_verified_at?: string;
  avatar?: string;
  gender: string;
  dob?: string;
  phone: string;
  address?: string;
  status: number;
  otp_code?: string;
  otp_expires_at?: string;
  otp_purpose?: string;
  is_verified: number;
  salary?: string;
  profile_description?: string;
  created_by?: number;
  approval_status: string;
  is_blocked: boolean;
  fcm_token?: string;
  password_changed_at?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

const AdminSettings: React.FC = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showOptionsFor, setShowOptionsFor] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchAdmins = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Call the real API
      const response = await adminApi.getAdminList(currentPage, 10);

      if (response.status && response.data) {
        // Handle nested data structure
        const adminsData = response.data.data || response.data;
        setAdmins(Array.isArray(adminsData) ? adminsData : []);

        // Set pagination info
        if (response.data.last_page) {
          setTotalPages(response.data.last_page);
        } else {
          setTotalPages(1);
        }
      } else {
        setAdmins([]);
        setTotalPages(1);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to fetch admins';
      setError(errorMessage);
      setAdmins([]);
      setTotalPages(1);
      console.error('Error fetching admins:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

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
      // Call the real API to delete the admin
      await adminSettingsApi.deleteAdmin(adminId);

      // Update the UI by removing the admin from the list
      setAdmins(admins.filter((admin) => admin.id !== adminId));
      setShowOptionsFor(null);

      // Show success message (optional)
      console.log('Admin removed successfully');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to remove admin';
      setError(errorMessage);
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

      {/* Header with Meet all admins, View All, and Create New Admin */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center justify-between w-full sm:justify-start sm:gap-4">
          <h1 className="text-lg sm:text-xl font-semibold">Meet all admins</h1>
          <button
            className="text-sm text-gray-600 hover:text-gray-800 sm:hidden"
            onClick={() => navigate('/admin/all-admins')}
          >
            View All
          </button>
        </div>
        <div className="hidden sm:flex items-center gap-8">
          <button
            className="text-sm text-gray-600 hover:text-gray-800"
            onClick={() => navigate('/admin/all-admins')}
          >
            View All
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-[#A5EA91] text-[#174B35] rounded-md flex items-center"
          >
            <span className="mr-1">+</span> Create New Admin
          </button>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-2 bg-[#A5EA91] text-[#174B35] rounded-md flex items-center text-sm w-full justify-center sm:hidden"
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
          <table className="w-full text-xs sm:text-sm min-w-[700px]">
            <thead>
              <tr className="text-left text-gray-700 bg-[#C8EDDF80]">
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                  Full Name
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                  Email
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                  Phone Number
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                  Date of Birth
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                  Gender
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                  Status
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm"></th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr
                  key={admin.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-2 sm:py-3 px-2 sm:px-4 flex items-center text-xs sm:text-sm">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 mr-2 overflow-hidden">
                      {admin.avatar ? (
                        <img
                          src={admin.avatar}
                          alt={`${admin.first_name} ${admin.last_name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                          {admin.first_name?.charAt(0) || 'A'}
                        </div>
                      )}
                    </div>
                    <span className="truncate">{`${admin.first_name} ${admin.last_name}`}</span>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                    <span className="truncate block">{admin.email}</span>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                    <span className="truncate block">{admin.phone}</span>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                    {admin.dob
                      ? (() => {
                          try {
                            return format(new Date(admin.dob), 'MMM dd, yyyy');
                          } catch {
                            return admin.dob;
                          }
                        })()
                      : 'N/A'}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm capitalize">
                    {admin.gender}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4">
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs ${
                        admin.is_verified
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {admin.is_verified ? 'Verified' : 'Unverified'}
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
            No Admins Found
          </h3>
          <p className="text-gray-500">No admin users have been created yet</p>
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
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        userType="admin"
        onSuccess={() => {
          // Refresh the admins list
          fetchAdmins();
        }}
      />
    </div>
  );
};

export default AdminSettings;
