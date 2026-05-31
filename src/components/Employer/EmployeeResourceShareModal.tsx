import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiSearch, FiX } from 'react-icons/fi';
import employerApi from '../../api/employerApi';
import resourcesApi from '../../api/resourcesApi';
import Toast from '../common/Toast';

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  occupations?: Array<{
    id: number;
    name: string;
  }>;
}

interface EmployeeResourceShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceId: number;
  resourceTitle: string;
}

const EmployeeResourceShareModal: React.FC<EmployeeResourceShareModalProps> = ({
  isOpen,
  onClose,
  resourceId,
  resourceTitle,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [toast, setToast] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
    isVisible: false,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toast helper functions
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  // Memoize fetchEmployees
  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoadingEmployees(true);
      const response = await employerApi.getEmployees();

      if (response.status) {
        // Handle the response structure - it might be nested
        const employeeData = response.data?.data || response.data || [];
        setEmployees(employeeData);
      } else {
        const errorMessage = response.message || 'Failed to fetch employees';
        showToast(errorMessage, 'error');
      }
    } catch (err: any) {
      console.error('Error fetching employees:', err);
      showToast('An error occurred while fetching employees', 'error');
    } finally {
      setIsLoadingEmployees(false);
    }
  }, []);

  // Fetch employees when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen, fetchEmployees]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSearchQuery('');
  };

  const handleShareResource = async () => {
    if (!selectedEmployee) {
      showToast('Please select an employee', 'error');
      return;
    }

    try {
      setIsSharing(true);
      const response = await resourcesApi.recommendResource(
        selectedEmployee.id,
        resourceId
      );

      if (response.status) {
        showToast(
          `Successfully shared "${resourceTitle}" with ${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
          'success'
        );
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        const errorMessage = response.message || 'Failed to share resource';
        showToast(errorMessage, 'error');
      }
    } catch (err: any) {
      console.error('Error sharing resource:', err);
      const errorMessage =
        err.response?.data?.message ||
        'An error occurred while sharing the resource';
      showToast(errorMessage, 'error');
    } finally {
      setIsSharing(false);
    }
  };

  const handleClose = () => {
    setSelectedEmployee(null);
    setSearchQuery('');
    onClose();
  };

  const filteredEmployees = searchQuery
    ? employees.filter(
        (employee) =>
          `${employee.first_name} ${employee.last_name}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (employee.occupations &&
            employee.occupations.some((occupation) =>
              occupation.name.toLowerCase().includes(searchQuery.toLowerCase())
            ))
      )
    : employees;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md relative z-10">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[25px] font-semibold text-gray-900 dark:text-gray-100">
              Share Resource
            </h2>
            <button
              onClick={handleClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <IoClose size={20} />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Share "{resourceTitle}" with an employee
            </p>
          </div>

          <div className="mb-5">
            <label className="block text-[13px] font-medium text-gray-900 dark:text-gray-100 mb-2">
              Search Employee
            </label>
            <div className="relative" ref={dropdownRef}>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees by name, email, or occupation"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>

              {selectedEmployee && (
                <div className="mt-2 p-3 bg-gray-50 border border-border-default rounded-lg relative">
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-400"
                    onClick={() => setSelectedEmployee(null)}
                  >
                    <FiX size={18} />
                  </button>
                  <div className="font-medium pr-6">
                    {selectedEmployee.first_name} {selectedEmployee.last_name}
                  </div>
                  {selectedEmployee.occupations &&
                    selectedEmployee.occupations.length > 0 && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedEmployee.occupations
                          .map((occ) => occ.name)
                          .join(', ')}
                      </div>
                    )}
                  <div className="text-xs text-gray-400">
                    {selectedEmployee.email}
                  </div>
                </div>
              )}

              {searchQuery && !selectedEmployee && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {isLoadingEmployees ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      Loading employees...
                    </div>
                  ) : filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        className="p-3 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleEmployeeSelect(employee)}
                      >
                        <div className="font-medium">
                          {employee.first_name} {employee.last_name}
                        </div>
                        {employee.occupations &&
                          employee.occupations.length > 0 && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {employee.occupations
                                .map((occ) => occ.name)
                                .join(', ')}
                            </div>
                          )}
                        <div className="text-xs text-gray-400">
                          {employee.email}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No employees found matching your search
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 border border-gray-300 hover:bg-elevated/50 rounded-md py-3 font-medium text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleShareResource}
              disabled={!selectedEmployee || isSharing}
              className="flex-1 bg-[#A5EA91] hover:bg-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md py-3 font-medium text-gray-800 dark:text-gray-200"
            >
              {isSharing ? 'Sharing...' : 'Share Resource'}
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default EmployeeResourceShareModal;
