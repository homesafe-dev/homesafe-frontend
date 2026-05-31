import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Heart, BookOpen, Star } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import StaffProfileAbout from '../../components/Employer/StaffProfileAbout';
import MedicalHistory from '../../components/Employer/StaffMedicHistory';
import EducationalResources from '../../components/Employer/StaffResources';
import StaffReview from '../../components/Employer/StaffReview';
import employerApi from '../../api/employerApi';
import contractApi from '../../api/contractApi';
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
  const [contractId, setContractId] = useState<number | undefined>(undefined);
  const [contractStatus, setContractStatus] = useState<string | undefined>(
    undefined
  );
  const [proposalId, setProposalId] = useState<number | undefined>(undefined);

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

        // Fetch employee data
        const employeeResponse = await employerApi.getEmployees();

        if (
          employeeResponse.status &&
          employeeResponse.data &&
          employeeResponse.data.data
        ) {
          const foundEmployee = employeeResponse.data.data.find(
            (emp: Employee) => emp.id === Number(employeeId)
          );

          if (foundEmployee) {
            setEmployee(foundEmployee);

            // Fetch contracts to find the contract for this employee
            try {
              const contractsResponse = await contractApi.getProposals();
              if (contractsResponse.status && contractsResponse.data) {
                const employeeContract = contractsResponse.data.find(
                  (proposal: any) =>
                    proposal.employee?.id === Number(employeeId) ||
                    proposal.contract?.employee_id === Number(employeeId)
                );

                if (employeeContract) {
                  setContractId(employeeContract.contract.id);
                  setContractStatus(employeeContract.contract.status);
                  setProposalId(employeeContract.proposal.id);
                }
              }
            } catch (contractErr) {
              console.error('Error fetching contract data:', contractErr);
              // Don't fail the whole page if contract fetch fails
            }
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
      <div className="p-0">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-0">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-0">
        <div className="bg-gray-50 border border-border-default text-gray-600 dark:text-gray-400 px-4 py-3 rounded-lg text-center">
          Employee not found
        </div>
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
    <div className="p-0">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <button
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 mb-4 transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Staff</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {employee.first_name} {employee.last_name}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Staff Profile Details
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left panel - Profile About */}
        <div className="w-full lg:w-1/3">
          <div className="bg-surface rounded-2xl shadow-sm border border-border-default p-4 sm:p-6">
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
              contractId={contractId}
              contractStatus={contractStatus}
              proposalId={proposalId}
            />
          </div>
        </div>

        {/* Right panel - Tabs */}
        <div className="w-full lg:w-2/3">
          <div className="bg-surface rounded-2xl shadow-sm border border-border-default">
            {/* Tabs */}
            <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-border-default">
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                    activeTab === 'medical'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 hover:bg-elevated/50'
                  }`}
                  onClick={() => setActiveTab('medical')}
                >
                  <Heart className="w-4 h-4" />
                  Medical History
                </button>
                <button
                  className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                    activeTab === 'educational'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 hover:bg-elevated/50'
                  }`}
                  onClick={() => setActiveTab('educational')}
                >
                  <BookOpen className="w-4 h-4" />
                  Educational Resources
                </button>
                <button
                  className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                    activeTab === 'reviews'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 hover:bg-elevated/50'
                  }`}
                  onClick={() => setActiveTab('reviews')}
                >
                  <Star className="w-4 h-4" />
                  Reviews
                </button>
              </div>
            </div>

            {/* Tab content */}
            <div className="p-4 sm:p-6">
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
    </div>
  );
};

export default StaffProfile;
