import React, { useState, useEffect } from 'react';
import { Search, Users, MapPin, Mail, Calendar, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import employerApi from '../../api/employerApi';
import { Employee } from '../../types/employee';
import Avatar from '../../components/common/Avatar';

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
    <div className="p-0">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Staff
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Manage and view all your staff members
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {/* Search Section */}
        <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or location..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Showing {filteredEmployees.length} of {employees.length} staff
            members
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg inline-block">
                {error}
              </div>
            </div>
          ) : filteredEmployees && filteredEmployees.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={employee.avatar}
                          firstName={employee.first_name}
                          lastName={employee.last_name}
                          size="md"
                          showStatus={true}
                          isOnline={employee.status === 1}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {employee.first_name} {employee.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{extractLocation(employee.address)}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="truncate max-w-[200px]">
                          {employee.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{calculateAge(employee.dob)}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          employee.is_verified === 1
                            ? 'bg-green-50 text-green-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        {employee.is_verified === 1 ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/employer/staff/profile/${employee.id}`}>
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium">
                          <Eye className="w-4 h-4" />
                          View Profile
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                No staff members found
              </p>
              <p className="text-sm text-gray-500">
                {searchTerm
                  ? 'Try adjusting your search criteria'
                  : 'No staff members have been added yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
