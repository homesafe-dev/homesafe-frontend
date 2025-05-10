import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaChevronDown } from 'react-icons/fa';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { LuCalendarDays } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import userApi from '../../api/userApi';

interface KYCFormData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  homeAddress: string;
  dateOfBirth: string;
  gender: string;
  occupation: string;
  bvn: string;
  meansOfIdentification1: string;
  meansOfIdentification2: string;
  proofOfAddress: string;
  photo: File | null;
  idDocument: File | null;
  addressDocument: File | null;
}

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  gender: string;
  [key: string]: any;
}

const EmployeeKYCPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // userProfile state is used to store the full user data, but we extract specific fields to formData
  const [, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<KYCFormData>({
    title: 'Mr',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    homeAddress: '',
    dateOfBirth: '',
    gender: '',
    occupation: '',
    bvn: '',
    meansOfIdentification1: '',
    meansOfIdentification2: '',
    proofOfAddress: '',
    photo: null,
    idDocument: null,
    addressDocument: null,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userApi.getProfile();
        if (response.status) {
          const userData = response.data;
          setUserProfile(userData);

          // Update form data with user profile information
          setFormData((prevFormData) => ({
            ...prevFormData,
            firstName: userData.first_name || '',
            lastName: userData.last_name || '',
            phoneNumber: userData.phone || '',
            email: userData.email || '',
            homeAddress: userData.address || '',
            dateOfBirth: userData.dob || '',
            gender: userData.gender || '',
          }));
        } else {
          setError('Failed to fetch user profile');
        }
      } catch (err) {
        setError('Error fetching user profile');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        [fieldName]: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      // Create FormData object for file uploads
      const kycFormData = new FormData();
      kycFormData.append('title', formData.title);
      kycFormData.append('first_name', formData.firstName);
      kycFormData.append('last_name', formData.lastName);
      kycFormData.append('email', formData.email);
      kycFormData.append('phone', formData.phoneNumber);
      kycFormData.append('address', formData.homeAddress);
      kycFormData.append('dob', formData.dateOfBirth);
      kycFormData.append('gender', formData.gender);
      kycFormData.append('occupation', formData.occupation);
      kycFormData.append('bvn', formData.bvn);
      kycFormData.append('id_type', formData.meansOfIdentification1);
      kycFormData.append('address_proof_type', formData.proofOfAddress);

      // Append files if they exist
      if (formData.photo) {
        kycFormData.append('photo', formData.photo);
      }

      if (formData.idDocument) {
        kycFormData.append('id_document', formData.idDocument);
      }

      if (formData.addressDocument) {
        kycFormData.append('address_document', formData.addressDocument);
      }

      const response = await userApi.submitKYC(kycFormData);

      if (response.status) {
        alert('KYC information submitted successfully');
        navigate('/employee/dashboard');
      } else {
        setError(response.message || 'Failed to submit KYC information');
      }
    } catch (err: any) {
      setError(err.message || 'Error submitting KYC information');
      console.error('Error submitting KYC information:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-[85%]">
      <div className="mb-6">
        <button
          className="flex items-center text-gray-600 hover:text-gray-800"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" />
          <span className="text-gray-800">Employee KYC</span>
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form */}
      <form className="mt-6 bg-white p-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
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
                name="title"
                className="appearance-none w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-700"
                value={formData.title}
                onChange={handleInputChange}
              >
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

          <div>
            <label
              htmlFor="bvn"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bank Verification Number
            </label>
            <div className="relative">
              <input
                type="text"
                id="bvn"
                name="bvn"
                placeholder="Provide BVN"
                value={formData.bvn}
                onChange={handleInputChange}
                className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo of you
            </label>
            <label className="w-full h-[50px] flex items-center px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-400 text-sm cursor-pointer">
              <IoCloudUploadOutline className="mr-2" />
              {formData.photo ? formData.photo.name : 'Upload or drag an image'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'photo')}
              />
            </label>
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>

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
                name="occupation"
                className="appearance-none w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-700"
                value={formData.occupation}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="Engineer">Engineer</option>
                <option value="Doctor">Doctor</option>
                <option value="Teacher">Teacher</option>
                <option value="Accountant">Accountant</option>
                <option value="Business Owner">Business Owner</option>
                <option value="Other">Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <FaChevronDown />
              </div>
            </div>
          </div>

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
              name="email"
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label
              htmlFor="meansOfIdentification1"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Means of Identification
            </label>
            <div className="relative">
              <select
                id="meansOfIdentification1"
                name="meansOfIdentification1"
                className="appearance-none w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-700"
                value={formData.meansOfIdentification1}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="national_id">National ID</option>
                <option value="drivers_license">Driver's License</option>
                <option value="passport">International Passport</option>
                <option value="voters_card">Voter's Card</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <FaChevronDown />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label
              htmlFor="idDocument"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Means of Identification
            </label>
            <label className="w-full h-[50px] flex items-center px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-400 text-sm cursor-pointer">
              <IoCloudUploadOutline className="mr-2" />
              {formData.idDocument
                ? formData.idDocument.name
                : 'Upload or drag an image'}
              <input
                type="file"
                id="idDocument"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'idDocument')}
              />
            </label>
          </div>

          <div>
            <label
              htmlFor="homeAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Home Address
            </label>
            <input
              type="text"
              id="homeAddress"
              name="homeAddress"
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.homeAddress}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label
              htmlFor="proofOfAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Proof of Address
            </label>
            <div className="relative">
              <select
                id="proofOfAddress"
                name="proofOfAddress"
                className="appearance-none w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-700"
                value={formData.proofOfAddress}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="utility_bill">Utility Bill</option>
                <option value="bank_statement">Bank Statement</option>
                <option value="tax_document">Tax Document</option>
                <option value="rental_agreement">Rental Agreement</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <FaChevronDown />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                placeholder="dd/mm/yyyy"
                className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <LuCalendarDays />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="addressDocument"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Proof of Address (E.g Utility bill, Bank statement)
            </label>
            <label className="w-full h-[50px] flex items-center px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-400 text-sm cursor-pointer">
              <IoCloudUploadOutline className="mr-2" />
              {formData.addressDocument
                ? formData.addressDocument.name
                : 'Upload or drag a file here'}
              <input
                type="file"
                id="addressDocument"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'addressDocument')}
              />
            </label>
          </div>

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
                name="gender"
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
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[#A5EA91] text-green-700 rounded-md hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={submitting}
          >
            {submitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-700 mr-2"></div>
                Processing...
              </div>
            ) : (
              'Save KYC'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeKYCPage;
