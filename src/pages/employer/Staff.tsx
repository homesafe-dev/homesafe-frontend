import React, { useState, useEffect } from 'react';
import { FaUser, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import employerApi from '../../api/employerApi';
import { Employee } from '../../types/employee';

const StaffPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await employerApi.getEmployees();
        console.log('API Response:', response); // Debug log

        // Based on the actual API response, the structure is:
        // { status: true, message: "...", data: { current_page: 1, data: [...employees], ... } }
        if (response && response.status === true) {
          // Check if data is an object with a data property (paginated response)
          if (
            response.data &&
            typeof response.data === 'object' &&
            'data' in response.data
          ) {
            const employeeData = response.data.data;

            if (Array.isArray(employeeData)) {
              console.log('Setting employees array:', employeeData);
              setEmployees(employeeData);
            } else {
              console.error(
                'Unexpected employee data format - not an array:',
                employeeData
              );
              setError('Unexpected data format received from API');
            }
          } else {
            console.error(
              'Unexpected response format - missing pagination data:',
              response.data
            );
            setError('Unexpected data format received from API');
          }
        } else {
          console.error('API response error:', response);
          setError(response?.message || 'Failed to load employees');
        }
      } catch (err: any) {
        console.error('Error fetching employees:', err);
        setError(err.message || 'Failed to load employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees based on search term
  const filteredEmployees = Array.isArray(employees)
    ? employees.filter((employee) => {
        const fullName =
          `${employee.first_name} ${employee.last_name}`.toLowerCase();
        return (
          fullName.includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (employee.address &&
            employee.address.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      })
    : [];

  // Calculate age from date of birth
  const calculateAge = (dob: string | null): string => {
    if (!dob) return 'N/A';

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return `${age} yrs old`;
  };

  // Extract location from address
  const extractLocation = (address: string | null): string => {
    if (!address) return 'N/A';

    // Try to extract city/state from address
    const addressParts = address.split(',');
    if (addressParts.length > 1) {
      return addressParts[addressParts.length - 2].trim();
    }

    return address.length > 20 ? address.substring(0, 20) + '...' : address;
  };

  return (
    <div className="rounded-lg w-full mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">My Staff</h1>
          <p className="text-gray-600 mt-2">Here are the names of your staff</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search staff..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="grid grid-cols-5 bg-[#C8EDDF80] px-4 h-[56px] items-center text-sm font-medium text-gray-600">
            <div>Employee Name</div>
            <div>Location</div>
            <div>Email</div>
            <div>Age</div>
            <div>Status</div>
          </div>

          {filteredEmployees && filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="grid grid-cols-5 items-center px-4 h-[56px] mb-2 last:mb-0 bg-white"
              >
                <div className="flex items-center gap-2 relative">
                  <div className="bg-gray-200 rounded-full p-2 flex items-center justify-center relative">
                    {employee.avatar ? (
                      <img
                        src={employee.avatar}
                        alt={`${employee.first_name} ${employee.last_name}`}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-white" />
                    )}
                    <div
                      className={`absolute w-3 h-3 ${employee.status === 1 ? 'bg-green-500' : 'bg-red-500'} rounded-full -top-1 -right-1 border-2 border-white`}
                    />
                  </div>
                  <span>
                    {employee.first_name} {employee.last_name}
                  </span>
                </div>
                <div>{extractLocation(employee.address)}</div>
                <div className="truncate">{employee.email}</div>
                <div>{calculateAge(employee.dob)}</div>
                <div className="flex justify-between items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      employee.is_verified === 1
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {employee.is_verified === 1 ? 'Verified' : 'Unverified'}
                  </span>
                  <Link to={`/employer/staff/profile?id=${employee.id}`}>
                    <button className="bg-green-200 text-green-800 px-3 py-1 rounded-md text-sm">
                      View Profile
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p>No staff members found</p>
              {/* <p className="mt-2 text-sm">You haven't added any staff members yet.</p>
              <Link to="/employer/staff/add">
                <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
                  Add Staff Member
                </button>
              </Link> */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StaffPage;
