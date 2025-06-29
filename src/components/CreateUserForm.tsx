import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import userRegistrationApi, {
  UserRegistrationData,
} from '../api/userRegistrationApi';
import adminApi from '../api/adminApi';

interface CreateUserFormProps {
  userType: 'agent' | 'employee' | 'employer' | 'admin';
  title: string;
  redirectPath: string;
}

interface Occupation {
  id: number;
  name: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({
  userType,
  title,
  redirectPath,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [agents] = useState<User[]>([]);
  const [employers] = useState<User[]>([]);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    salary: 0,
    occupations: [] as number[],
    agent_id: '',
    employer_id: '',
  });

  useEffect(() => {
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
  }, [userType]);

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
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (userType === 'employee' && formData.occupations.length === 0) {
      setError('Please select at least one occupation');
      setIsLoading(false);
      return;
    }

    if (
      userType === 'employee' &&
      (!formData.agent_id || !formData.employer_id)
    ) {
      setError('Please select both an agent and an employer for the employee');
      setIsLoading(false);
      return;
    }

    try {
      const userData: UserRegistrationData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        salary: formData.salary,
        role: userType,
        occupations:
          userType === 'admin' ||
          userType === 'agent' ||
          userType === 'employer'
            ? [1]
            : formData.occupations, // Default occupation for admin/agent/employer
      };

      if (userType === 'employee') {
        userData.agent_id = Number(formData.agent_id);
        userData.employer_id = Number(formData.employer_id);
      }

      const response = await userRegistrationApi.registerUser(userData);

      if (response.status) {
        setSuccess(`${title} created successfully!`);
        setTimeout(() => {
          navigate(redirectPath);
        }, 2000);
      } else {
        setError(response.message || `Failed to create ${userType}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || `Error creating ${userType}`);
    } finally {
      setIsLoading(false);
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
          <span className="text-gray-800">Back</span>
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">{title}</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Remove salary fields for all user types as per requirements */}

          {userType === 'employee' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agent *
                </label>
                <select
                  name="agent_id"
                  value={formData.agent_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select an agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.first_name} {agent.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employer *
                </label>
                <select
                  name="employer_id"
                  value={formData.employer_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select an employer</option>
                  {employers.map((employer) => (
                    <option key={employer.id} value={employer.id}>
                      {employer.first_name} {employer.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {userType === 'employee' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Occupations *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : `Create ${title}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;
