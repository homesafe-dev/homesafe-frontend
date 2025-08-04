import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import userRegistrationApi, {
  UserRegistrationData,
} from '../api/userRegistrationApi';
import adminApi from '../api/adminApi';
import Toast from './common/Toast';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'agent' | 'employee' | 'employer' | 'admin';
  onSuccess?: () => void;
}

interface Occupation {
  id: number;
  name: string;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  userType,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [toast, setToast] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
    isVisible: false,
  });

  // Toast helper functions
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    salary: 0,
    occupations: [] as number[],
    agent_id: '',
    employer_id: '',
  });

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          // Only fetch occupations for employees
          if (userType === 'employee') {
            const occupationsResponse = await adminApi.getOccupations();
            if (occupationsResponse.status) {
              setOccupations(occupationsResponse.data || []);
            }
          }
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      };

      fetchData();
    }
  }, [isOpen, userType]);

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      salary: 0,
      occupations: [],
      agent_id: '',
      employer_id: '',
    });
    setError(null);
    setSuccess(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'salary' ? Number(value) : value,
    }));
  };

  const handleOccupationChange = (occupationId: number) => {
    setFormData((prev) => ({
      ...prev,
      occupations: prev.occupations.includes(occupationId)
        ? prev.occupations.filter((id) => id !== occupationId)
        : [...prev.occupations, occupationId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (userType === 'employee' && formData.occupations.length === 0) {
      setError('Please select at least one occupation');
      setIsLoading(false);
      return;
    }

    // Remove agent and employer requirement for employees
    // if (userType === 'employee' && (!formData.agent_id || !formData.employer_id)) {
    //   setError('Please select both an agent and an employer for the employee');
    //   setIsLoading(false);
    //   return;
    // }

    try {
      // Generate a default password (users can change it later)
      const defaultPassword = `${formData.first_name.toLowerCase()}${new Date().getFullYear()}`;

      const userData: UserRegistrationData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        password: defaultPassword,
        salary: formData.salary,
        role: userType,
        occupations:
          userType === 'admin' ||
          userType === 'agent' ||
          userType === 'employer'
            ? [1]
            : formData.occupations,
      };

      // Remove agent and employer assignment for employees
      // if (userType === 'employee') {
      //   userData.agent_id = Number(formData.agent_id);
      //   userData.employer_id = Number(formData.employer_id);
      // }

      const response = await userRegistrationApi.registerUser(userData);

      if (response.status) {
        const successMessage = `${userType.charAt(0).toUpperCase() + userType.slice(1)} created successfully!`;
        setSuccess(successMessage);
        showToast(successMessage, 'success');
        setTimeout(() => {
          handleClose();
          if (onSuccess) onSuccess();
        }, 1500);
      } else {
        const errorMessage = response.message || `Failed to create ${userType}`;
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || `Error creating ${userType}`;
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            Create New {userType.charAt(0).toUpperCase() + userType.slice(1)}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded">
          <p className="text-sm">
            <strong>Note:</strong> A default password will be generated for the
            user. They can change it after their first login.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Remove salary fields for all user types as per requirements */}

          {/* Remove agent and employer selection for employees as per requirements */}

          {userType === 'employee' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Occupations *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                {occupations.map((occupation) => (
                  <label key={occupation.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.occupations.includes(occupation.id)}
                      onChange={() => handleOccupationChange(occupation.id)}
                      className="mr-2"
                    />
                    <span className="text-sm">{occupation.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          {success && (
            <div className="text-green-500 text-sm mb-2">{success}</div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading
                ? 'Creating...'
                : `Create ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}
            </button>
          </div>
        </form>
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

export default CreateUserModal;
