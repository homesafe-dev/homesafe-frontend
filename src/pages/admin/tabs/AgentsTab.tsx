import { useEffect, useState } from 'react';
import { FaUser, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import agentApi from '../../../api/agentApi';
import DropdownMenu from '../../../components/common/DropdownMenu';
import axiosInstance from '../../../api/axiosConfig';

interface Agent {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string;
  status: string;
  total_employees: number;
  average_rating: number | null;
  total_reviews: number;
  // Optional fields that might be in different API responses
  gender?: string;
  address?: string;
  created_at?: string;
  is_verified?: number;
}

interface Occupation {
  id: number;
  name: string;
}

interface CreateAgentFormData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  dob: string;
  address: string;
  salary: string;
  occupations: number[];
}

export default function AgentsTab() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [isLoadingOccupations, setIsLoadingOccupations] = useState(false);
  const [formData, setFormData] = useState<CreateAgentFormData>({
    email: '',
    first_name: '',
    last_name: '',
    password: 'passw0rd', // Default password
    dob: '1990-01-01', // Default date of birth
    address: '',
    salary: '100000', // Default salary
    occupations: [],
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      // Use a larger limit to ensure we get all agents
      const response = await adminApi.getAgentList(1, 100);
      if (response.status) {
        // The agents array is in response.data.data
        setAgents(response.data.data || []);
      } else {
        setError(response.message || 'Failed to fetch agents');
      }
    } catch (err) {
      setError('Error fetching agents');
      console.error('Error fetching agents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();

    // Fetch occupations
    const fetchOccupations = async () => {
      try {
        setIsLoadingOccupations(true);
        const response = await agentApi.getOccupations();
        if (response.status && response.data) {
          setOccupations(response.data);
        } else {
          console.error('Failed to fetch occupations:', response.message);
        }
      } catch (err) {
        console.error('Error fetching occupations:', err);
      } finally {
        setIsLoadingOccupations(false);
      }
    };

    fetchOccupations();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'occupation') {
      // Handle occupation selection
      setFormData({
        ...formData,
        occupations: [parseInt(value)],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);

    try {
      // Create FormData for the API request
      const formDataObj = new FormData();

      // Add all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'occupations' && Array.isArray(value)) {
          // Handle occupations array
          value.forEach((occupation) => {
            formDataObj.append(`occupations[]`, occupation.toString());
          });
        } else {
          formDataObj.append(key, value as string);
        }
      });

      // Make the API request
      const response = await axiosInstance.post('/register-agent', formDataObj);

      if (response.data.status) {
        setFormSuccess(response.data.message || 'Agent created successfully');
        // Reset form
        setFormData({
          email: '',
          first_name: '',
          last_name: '',
          password: 'passw0rd',
          dob: '1990-01-01',
          address: '',
          salary: '100000',
          occupations: [],
        });
        // Close modal after a delay
        setTimeout(() => {
          setIsModalOpen(false);
          // Refresh agent list
          fetchAgents();
        }, 1500);
      } else {
        setFormError(response.data.message || 'Failed to create agent');
      }
    } catch (err: any) {
      console.error('Error creating agent:', err);
      setFormError(err.response?.data?.message || 'An error occurred while creating the agent');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Agents</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Create New Agent
        </button>
      </div>

      <table className="w-full">
        <thead className="bg-[#C8EDDF80] h-[56px] text-left">
          <tr>
            <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
              Full Name
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
              Email
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
              Location
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
              Total Employees
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
              Phone Number
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal">
              Status
            </th>
            <th className="px-6 py-3 text-[13px] text-[#174B35] font-normal"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {isLoading ? (
            // Loading state - show skeleton rows
            [...Array(3)].map((_, index) => (
              <tr key={index} className="hover:bg-gray-50 animate-pulse">
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 rounded"></div>
                </td>
              </tr>
            ))
          ) : error ? (
            // Error state
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-red-500">
                {error}
              </td>
            </tr>
          ) : agents.length === 0 ? (
            // Empty state
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                No agents found
              </td>
            </tr>
          ) : (
            // Data loaded successfully
            agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-2 text-[13px] text-[#24292E] font-normal">
                  <div className="flex items-center gap-2 relative">
                    {agent.avatar ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden relative">
                        <img
                          src={agent.avatar}
                          alt={`${agent.first_name} ${agent.last_name}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute w-3 h-3 bg-green-500 rounded-full -top-1 -right-1 border-2 border-white" />
                      </div>
                    ) : (
                      <div className="bg-[#BDBDBD] rounded-full p-2 flex items-center justify-center relative">
                        <FaUser className="text-white" />
                        <div className="absolute w-3 h-3 bg-green-500 rounded-full -top-1 -right-1 border-2 border-white" />
                      </div>
                    )}
                  </div>
                  {`${agent.first_name} ${agent.last_name}`}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  {agent.email || 'N/A'}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  {agent.address ? agent.address.split(',')[0] : 'Lagos'}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  {agent.total_employees !== undefined ? agent.total_employees : 'N/A'}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#24292E] font-normal">
                  {agent.phone || 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[13px] ${
                      agent.status === 'not verified'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {agent.status === 'not verified' ? 'Unverified' : 'Verified'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu
                    options={[
                      {
                        label: 'View Details',
                        onClick: () => navigate(`/admin/user/${agent.id}`),
                      },
                    ]}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Create Agent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Create New Agent</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name*
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password*
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth*
                  </label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address*
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                    Salary*
                  </label>
                  <input
                    type="number"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
                    Occupation*
                  </label>
                  <select
                    id="occupation"
                    name="occupation"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select an occupation</option>
                    {occupations.map((occupation) => (
                      <option key={occupation.id} value={occupation.id}>
                        {occupation.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
