import React from 'react';
import { FaArrowLeft, FaChevronDown } from 'react-icons/fa';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { LuCalendarDays } from 'react-icons/lu';

const KYCPage: React.FC = () => {
  const formData = {
    title: 'Mr',
    firstName: 'John',
    lastName: 'Duke',
    email: 'name@email.com',
    phoneNumber: '0701234567',
    homeAddress: 'No 5 Kuria street V1',
    dateOfBirth: '',
    gender: '',
    occupation: '',
    meansOfIdentification1: '',
    meansOfIdentification2: '',
    proofOfAddress: '',
  };

  return (
    <div className=" w-[85%]">
      <div className="mb-6">
        <button className="flex items-center text-gray-600 hover:text-gray-800">
          <FaArrowLeft className="mr-2" />
          <span className="text-gray-800">KYC</span>
        </button>
      </div>

      {/* Form */}
      <form className="mt-6 bg-white p-8">
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
                className="appearance-none w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-700"
                value={formData.title}
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
                placeholder="Provide BVN"
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
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.firstName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo of you
            </label>
            <button className="w-full h-[50px] flex items-center px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-400 text-sm">
              <IoCloudUploadOutline className="mr-2" />
              Upload or drag an image
            </button>
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

          <div>
            <label
              htmlFor="id1"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Means of Identification
            </label>
            <div className="relative">
              <select
                id="id1"
                className="appearance-none w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-700"
              >
                <option value="">Select</option>
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
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.phoneNumber}
            />
          </div>

          <div>
            <label
              htmlFor="id2"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Means of Identification
            </label>
            <button className="w-full h-[50px] flex items-center px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-400 text-sm">
              <IoCloudUploadOutline className="mr-2" />
              Upload or drag an image
            </button>
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
              className="w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700"
              value={formData.homeAddress}
            />
          </div>

          <div>
            <label
              htmlFor="proofAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Proof of Address
            </label>
            <div className="relative">
              <select
                id="proofAddress"
                className="appearance-none w-full h-[50px] px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-700"
              >
                <option value="">Select</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <FaChevronDown />
              </div>
            </div>
          </div>

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

          <div>
            <label
              htmlFor="proofUtility"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Proof of Address (E.g Utility bill, Bank statement)
            </label>
            <button className="w-full h-[50px] flex items-center px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-400 text-sm">
              <IoCloudUploadOutline className="mr-2" />
              Upload or drag a file here
            </button>
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
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[#A5EA91] text-green-700 rounded-md hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Save KYC
          </button>
        </div>
      </form>
    </div>
  );
};

export default KYCPage;
