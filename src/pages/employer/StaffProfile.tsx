import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import StaffProfileAbout from '../../components/Employer/StaffProfileAbout';
import MedicalHistory from '../../components/Employer/StaffMedicHistory';
import EducationalResources from '../../components/Employer/StaffResources';
import StaffReview from '../../components/Employer/StaffReview';
import employerApi from '../../api/employerApi';
import ArtisanImg from '../../assets/images/artisans.png';

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  gender: string;
  dob: string;
  phone: string;
  address: string;
  salary: string;
  profile_description: string | null;
  approval_status: string;
  is_verified: number;
  reviews: any[];
  user_medicals: {
    id: number;
    user_id: number;
    medical_file: string;
    date_uploaded: string;
    created_at: string;
    updated_at: string;
  }[];
  occupations: {
    id: number;
    name: string;
    pivot: {
      user_id: number;
      occupation_id: number;
    };
  }[];
  pivot: {
    employer_id: number;
    user_id: number;
  };
}

const StaffProfile: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('medical');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!employeeId) {
        setError('No employee ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await employerApi.getEmployees();

        if (response.status && response.data && response.data.data) {
          const foundEmployee = response.data.data.find(
            (emp: Employee) => emp.id === Number(employeeId)
          );

          if (foundEmployee) {
            setEmployee(foundEmployee);
          } else {
            setError('Employee not found');
          }
        } else {
          setError('Failed to fetch employee data');
        }
      } catch (err: any) {
        console.error('Error fetching employee data:', err);
        setError(err.message || 'Failed to fetch employee data');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [employeeId]);

  const calculateAge = (dob: string) => {
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

    return age;
  };

  const extractLocation = (address: string) => {
    // Extract city/state from address
    const parts = address.split(',');
    return parts.length > 1 ? parts[parts.length - 1].trim() : address;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
        {error}
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="bg-gray-50 text-gray-600 p-4 rounded-lg text-center">
        Employee not found
      </div>
    );
  }

  // Prepare data for components
  const educationalResources = [
    // This would come from API in the future
    {
      title: 'Professional Development',
      startDate: '24th Nov, 2024',
      description: 'Ongoing professional development and training resources.',
      chapterCount: 0,
      recipeCount: 0,
      thumbnail: '/path-to-thumbnail.jpg',
    },
  ];

  return (
    <div className="rounded-lg p-3 sm:p-4 lg:p-6">
      <div className="p-3 sm:p-4 border-b border-gray-100">
        <button
          className="flex items-center text-gray-600"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" size={16} />
          <span className="text-sm sm:text-base">
            {employee.first_name}'s Profile
          </span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 mt-4 sm:mt-6">
        {/* Left panel */}
        <div className="w-full lg:w-1/3 lg:border-r bg-white border-gray-100 p-4 sm:p-6 shadow-md rounded-lg lg:rounded-none">
          <StaffProfileAbout
            name={`${employee.first_name} ${employee.last_name}`}
            location={extractLocation(employee.address)}
            age={calculateAge(employee.dob)}
            role={
              employee.occupations.length > 0
                ? employee.occupations[0].name
                : 'Staff'
            }
            bio={
              employee.profile_description ||
              `Meet ${employee.first_name} ${employee.last_name}, a dedicated professional who brings skill and commitment to their work.`
            }
            phone={employee.phone}
            email={employee.email}
            profileImage={employee.avatar || ArtisanImg}
            rating={4.0} // Default rating, would come from reviews calculation
            contractId={employee.id} // Pass employee ID as contract ID for termination
          />
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-2/3">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              className={`px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base ${activeTab === 'medical' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('medical')}
            >
              Medical History
            </button>
            <button
              className={`px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base ${activeTab === 'educational' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('educational')}
            >
              Educational Resources
            </button>
            <button
              className={`px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base ${activeTab === 'reviews' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>

          {/* Tab content */}
          <div className="p-2 sm:p-4">
            {activeTab === 'medical' && (
              <MedicalHistory
                medicalFiles={employee.user_medicals}
                employeeName={employee.first_name}
              />
            )}
            {activeTab === 'educational' && (
              <EducationalResources resources={educationalResources} />
            )}
            {activeTab === 'reviews' && (
              <StaffReview
                reviews={employee.reviews}
                employeeName={`${employee.first_name} ${employee.last_name}`}
                employeeId={employee.id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
