import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaChevronDown } from 'react-icons/fa';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import agentApi from '../../api/agentApi';

interface Occupation {
  id: number;
  name: string;
}

interface CandidateFormData {
  title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  gender: string;
  occupation: number;
  password: string;
  salary: string;
  photo: File | null;
}

const CandidatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [loadingOccupations, setLoadingOccupations] = useState(true);

  // Fetch occupations from API
  useEffect(() => {
    const fetchOccupations = async () => {
      try {
        setLoadingOccupations(true);
        const response = await agentApi.getOccupations();
        if (response.status && response.data) {
          setOccupations(response.data);
        } else {
          console.error('Failed to fetch occupations:', response.message);
        }
      } catch (err) {
        console.error('Error fetching occupations:', err);
      } finally {
        setLoadingOccupations(false);
      }
    };

    fetchOccupations();
  }, []);

  const [formData, setFormData] = useState<CandidateFormData>({
    title: 'Mr',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    gender: '',
    occupation: 0,
    password: 'passw0rd', // Default password
    salary: '100000', // Default salary
    photo: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        photo: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare the data for API
      const candidateData = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
        dob: formData.dob,
        address: formData.address,
        salary: formData.salary,
        occupations: [formData.occupation],
        gender: formData.gender,
        phone: formData.phone,
      };

      // Call the API with the photo file
      const response = await agentApi.registerCandidate(
        candidateData,
        formData.photo
      );

      if (response.status) {
        setSuccess(response.message || 'Candidate registered successfully');
        // Reset form or navigate
        setTimeout(() => {
          navigate('/agent/all-candidates');
        }, 1500);
      } else {
        setError(response.message || 'Failed to register candidate');
      }
    } catch (err: any) {
      setError(
        err.message || 'An error occurred while registering the candidate'
      );
      console.error('Error registering candidate:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[85%]">
      <div className="mb-6">
        <button
          className="flex items-center text-gray-600 hover:text-gray-800"
          onClick={() => navigate('/agent/all-candidates')}
        >
          <FaArrowLeft className="mr-2" />
          <span className="text-gray-800">Back to Candidates</span>
        </button>
      </div>

      <div className="text-2xl font-semibold mb-6">Add Candidate</div>

      {/* Success and Error Messages */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Form */}
      <form className="mt-6 bg-white p-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <div className="relative">
              <select
                id="title"
                className="appearance-none w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-700"
                value={formData.title}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <FaChevronDown />
              </div>
            </div>
          </div>

          {/* Gender */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Gender
            </label>
            <div className="relative">
              <select
                id="gender"
                className="appearance-none w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-700"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <FaChevronDown />
              </div>
            </div>
          </div>

          {/* First Name */}
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.first_name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Occupation */}
          <div>
            <label
              htmlFor="occupation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Occupation
            </label>
            <div className="relative">
              <select
                id="occupation"
                className="appearance-none w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-700"
                value={formData.occupation}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                {loadingOccupations ? (
                  <option value="" disabled>
                    Loading occupations...
                  </option>
                ) : (
                  occupations.map((occupation: Occupation) => (
                    <option key={occupation.id} value={occupation.id}>
                      {occupation.name}
                    </option>
                  ))
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <FaChevronDown />
              </div>
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.last_name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label
              htmlFor="dob"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="date"
                id="dob"
                className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
                value={formData.dob}
                onChange={handleInputChange}
                required
              />
              {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <LuCalendarDays />
              </div> */}
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Salary */}
          <div>
            <label
              htmlFor="salary"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Salary
            </label>
            <input
              type="text"
              id="salary"
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.salary}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Home Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Home Address
            </label>
            <input
              type="text"
              id="address"
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Photo of you */}
          <div>
            <label
              htmlFor="photo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Photo of you
            </label>
            <label className="w-full h-[50px] flex items-center px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-400 text-sm cursor-pointer">
              <IoCloudUploadOutline className="mr-2" />
              {formData.photo ? formData.photo.name : 'Upload or drop an image'}
              <input
                type="file"
                id="photo"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[#A5EA91] text-[#24292E] rounded-md hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Information'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidatesPage;
