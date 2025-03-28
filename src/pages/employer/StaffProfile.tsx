// StaffProfile.tsx
import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import StaffProfileAbout from '../../components/Employer/StaffProfileAbout';
import MedicalHistory from '../../components/Employer/StaffMedicHistory';
import EducationalResources from '../../components/Employer/StaffResources';
import Salary from '../../components/Employer/StaffSalary';
import Loan from '../../components/Employer/StaffLoan';
import StaffReview from '../../components/Employer/StaffReview';
import ArtisanImg from '../../assets/images/artisans.png';
const StaffProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('medical');

  const staffData = {
    name: 'Cali Foster Jenkins',
    location: 'Lagos',
    age: 23,
    role: 'Chef',
    bio: 'Meet Cali foster, a passionate chef from Lagos State, Nigeria. With a love for cooking that knows no bounds, Cali brings the flavors of Lagos to every dish. From traditional Nigerian cuisine to innovative fusion dishes, this Lagos-born chef is dedicated to sharing the rich culinary heritage of his hometown with the world.',
    phone: '+234 700 1234 456',
    email: 'califoster@email.com',
    profileImage: ArtisanImg,
    rating: 4.5,
  };

  const educationalResources = [
    {
      title: 'Best way to make Pasta',
      startDate: '24th Nov, 2024',
      description:
        'A book on how well to improve in pasta making, this helps you to be an expert in the kitchen.',
      chapterCount: 34,
      recipeCount: 28,
      thumbnail: '/path-to-thumbnail.jpg', // Replace with actual path
    },
    {
      title: 'Culinary Skills',
      startDate: '24th Nov, 2024',
      description:
        'A book on how well to improve in pasta making, this helps you to be an expert in the kitchen.',
      chapterCount: 34,
      recipeCount: 28,
      thumbnail: '/path-to-thumbnail.jpg', // Replace with actual path
    },
  ];

  const salaryData = {
    currentSalary: '100,000.00',
    advancedLoan: '-',
    accountDetails: {
      bank: 'Wema Bank',
      accountNumber: '1234567890',
    },
    nextPaymentDate: '25th Nov, 2024',
    salaryHistory: [
      {
        paymentDate: '24th Dec 2024',
        accountDetails: {
          bank: 'Wema Bank',
          accountNumber: '0123456789',
        },
        amount: '₦50,000',
        salaryAdvance: '-',
        redeemSalary: '-',
        status: 'Paid',
      },
      {
        paymentDate: '24th Dec 2024',
        accountDetails: {
          bank: 'Wema Bank',
          accountNumber: '0123456789',
        },
        amount: '₦50,000',
        salaryAdvance: '-',
        redeemSalary: '-',
        status: 'Paid',
      },
      {
        paymentDate: '24th Dec 2024',
        accountDetails: {
          bank: 'Wema Bank',
          accountNumber: '0123456789',
        },
        amount: '₦50,000',
        salaryAdvance: '-',
        redeemSalary: '-',
        status: 'Paid',
      },
      {
        paymentDate: '24th Dec 2024',
        accountDetails: {
          bank: 'Wema Bank',
          accountNumber: '0123456789',
        },
        amount: '₦50,000',
        salaryAdvance: '-',
        redeemSalary: '-',
        status: 'Paid',
      },
      {
        paymentDate: '24th Dec 2024',
        accountDetails: {
          bank: 'Wema Bank',
          accountNumber: '0123456789',
        },
        amount: '₦50,000',
        salaryAdvance: '-',
        redeemSalary: '-',
        status: 'Paid',
      },
      // Add more history items as needed
    ],
  };

  return (
    <div className="rounded-lg ">
      <div className="p-4 border-b border-gray-100">
        <button className="flex items-center text-gray-600">
          <FaArrowLeft className="mr-2" />
          <span>Cali's Profile</span>
        </button>
      </div>

      <div className="flex flex-row gap-8">
        {/* Left panel */}
        <div className="w-1/3 border-r bg-white border-gray-100 p-6 shadow-md">
          <StaffProfileAbout
            name={staffData.name}
            location={staffData.location}
            age={staffData.age}
            role={staffData.role}
            bio={staffData.bio}
            phone={staffData.phone}
            email={staffData.email}
            profileImage={staffData.profileImage}
            rating={staffData.rating}
          />
        </div>

        {/* Right panel */}
        <div className="w-2/3">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-3 ${activeTab === 'medical' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('medical')}
            >
              Medical History
            </button>
            <button
              className={`px-4 py-3 ${activeTab === 'educational' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('educational')}
            >
              Educational Resources
            </button>
            <button
              className={`px-4 py-3 ${activeTab === 'salary' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('salary')}
            >
              Salary
            </button>
            <button
              className={`px-4 py-3 ${activeTab === 'loan' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('loan')}
            >
              Loan
            </button>
            <button
              className={`px-4 py-3 ${activeTab === 'reviews' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>

          {/* Tab content */}
          <div className="p-2">
            {activeTab === 'medical' && (
              <MedicalHistory reportDate="24th November" />
            )}
            {activeTab === 'educational' && (
              <EducationalResources resources={educationalResources} />
            )}
            {activeTab === 'salary' && <Salary {...salaryData} />}
            {activeTab === 'loan' && <Loan />}
            {activeTab === 'reviews' && <StaffReview />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
