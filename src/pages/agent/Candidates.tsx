import React from 'react';
import { FaArrowLeft, FaChevronDown } from 'react-icons/fa';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { LuCalendarDays } from 'react-icons/lu';
import { Link } from 'react-router-dom';

const CandidatesPage: React.FC = () => {
  const formData = {
    title: '',
    firstName: 'John',
    lastName: 'Duke',
    email: 'name@email.com',
    phoneNumber: '07012345678',
    homeAddress: 'name@email.com',
    dateOfBirth: '',
    gender: '',
    occupation: '',
    photo: '',
    meansOfIdentification: '',
    proofOfMedicalRecord: '',
    proofOfEmploymentHistory: '',
    aboutYou: '',
  };

  return (
    <div className="w-[85%]">
      <div className="mb-6">
        <button className="flex items-center text-gray-600 hover:text-gray-800">
          <FaArrowLeft className="mr-2" />
          <span className="text-gray-800">Candidate</span>
        </button>
      </div>

      <div className="text-2xl font-semibold mb-6">Add Candidate</div>

      {/* Form */}
      <form className="mt-6 bg-white p-8">
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
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.firstName}
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
              >
                <option value="">Select</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <FaChevronDown />
              </div>
            </div>
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
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.lastName}
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
                type="text"
                id="dob"
                placeholder="dd/mm/yyyy"
                className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <LuCalendarDays />
              </div>
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
            />
          </div>

          {/* Means of Identification */}
          <div>
            <label
              htmlFor="identification"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Means of Identification
            </label>
            <button className="w-full h-[50px] flex items-center px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-400 text-sm">
              <IoCloudUploadOutline className="mr-2" />
              Upload or drop an image
            </button>
          </div>

          {/* Phone Number */}
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
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.phoneNumber}
            />
          </div>

          {/* Proof of Medical Record */}
          <div>
            <label
              htmlFor="medicalRecord"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Proof of Medical Record
            </label>
            <button className="w-full h-[50px] flex items-center px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-400 text-sm">
              <IoCloudUploadOutline className="mr-2" />
              Upload or drop an image
            </button>
          </div>

          {/* Home Address */}
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
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.homeAddress}
            />
          </div>

          {/* Proof of Employment History */}
          <div>
            <label
              htmlFor="employmentHistory"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Proof of Employment History
            </label>
            <button className="w-full h-[50px] flex items-center px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-400 text-sm">
              <IoCloudUploadOutline className="mr-2" />
              Upload or drop an image
            </button>
          </div>

          {/* Photo of you */}
          <div>
            <label
              htmlFor="photo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Photo of you
            </label>
            <button className="w-full h-[50px] flex items-center px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-400 text-sm">
              <IoCloudUploadOutline className="mr-2" />
              Upload or drop an image
            </button>
          </div>

          {/* Tell Us About You */}
          <div>
            <label
              htmlFor="aboutYou"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tell Us About You
            </label>
            <textarea
              id="aboutYou"
              placeholder="A brief info of you"
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
            <Link to="/agent/all-candidates">
          <button
            type="submit"
            className="px-6 py-2 bg-[#A5EA91] text-[#24292E] rounded-md hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Save Information
          </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CandidatesPage;
