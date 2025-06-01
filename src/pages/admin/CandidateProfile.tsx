import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import ArtisanImg from '../../assets/images/artisans.png';

// Import components
import CandidateProfileAbout from '../../components/Agent/CandidateProfileAbout';
import CandidateMedicHistory from '../../components/Agent/CandidateMedicHistory';
import CandidateResources from '../../components/Agent/CandidateResources';
import CandidateWorkSchedule from '../../components/Agent/CandidateWorkSchedule';
import CandidateReview from '../../components/Agent/CandidateReview';

interface Employee {
  id: number;
  candidate: string;
  title: string;
  email: string;
  avatar?: string;
  date: string;
  placement: string;
  gender: string;
  phone: string;
  status: string;
}

const AdminCandidateProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('medical');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sample educational resources data
  const educationalResources = [
    {
      title: 'Best way to make Pasta',
      startDate: '24th Nov, 2024',
      description:
        'A book on how well to improve in pasta making, this helps you to be an expert in the kitchen.',
      chapterCount: 34,
      recipeCount: 28,
      thumbnail: '',
    },
    {
      title: 'Culinary Skills',
      startDate: '24th Nov, 2024',
      description:
        'A book on how well to improve in pasta making, this helps you to be an expert in the kitchen.',
      chapterCount: 34,
      recipeCount: 28,
      thumbnail: '',
    },
  ];

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await adminApi.getEmployeeById(id);

        if (response.status) {
          setEmployee(response.data);
        } else {
          setError(response.message || 'Failed to fetch employee details');
        }
      } catch (err: any) {
        setError('Error fetching employee details');
        console.error('Error fetching employee details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [id]);

  const goBack = () => {
    navigate(-1);
  };

  const handleBlockUser = async () => {
    if (!employee) return;

    try {
      const response = await adminApi.blockUser(employee.id);
      if (response.status) {
        alert('User blocked successfully');
        // Optionally navigate back or refresh data
      } else {
        alert(response.message || 'Failed to block user');
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      alert('An error occurred while blocking the user');
    }
  };

  const handleSuspendUser = async () => {
    if (!employee) return;

    try {
      const response = await adminApi.suspendUser(employee.id);
      if (response.status) {
        alert('User suspended successfully');
        // Optionally navigate back or refresh data
      } else {
        alert(response.message || 'Failed to suspend user');
      }
    } catch (error) {
      console.error('Error suspending user:', error);
      alert('An error occurred while suspending the user');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-lg">
        {error || 'Failed to load employee details'}
      </div>
    );
  }

  // Format candidate name for display
  const candidateName = employee.candidate || 'Candidate';

  return (
    <div className="rounded-lg">
      <div className="p-4 border-b border-gray-100">
        <button className="flex items-center text-gray-600" onClick={goBack}>
          <FaArrowLeft className="mr-2" />
          <span>{candidateName}'s Profile</span>
        </button>
      </div>

      <div className="flex flex-row gap-8">
        {/* Left panel */}
        <div className="w-1/3 border-r bg-white border-gray-100 p-6 shadow-md">
          <CandidateProfileAbout
            name={employee.candidate}
            location={employee.placement || 'Not assigned'}
            age={0} // Age not available in the API response
            role={employee.title || 'Domestic Staff'}
            bio={`${employee.candidate} is a ${employee.gender} domestic staff.`}
            phone={employee.phone}
            email={employee.email}
            profileImage={employee.avatar || ArtisanImg}
            rating={4.0} // Default rating
            showAdminActions={true}
            onBlockUser={handleBlockUser}
            onSuspendUser={handleSuspendUser}
          />
        </div>

        {/* Right panel */}
        <div className="w-2/3">
          {/* Tabs */}
          <div className="flex">
            <button
              className={`px-4 py-3 ${activeTab === 'medical' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('medical')}
            >
              Medical History
            </button>
            <button
              className={`px-4 py-3 ${activeTab === 'educational' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('educational')}
            >
              Educational Resources
            </button>
            <button
              className={`px-4 py-3 ${activeTab === 'schedule' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('schedule')}
            >
              Work Schedule
            </button>
            <button
              className={`px-4 py-3 ${activeTab === 'reviews' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>

          {/* Tab content */}
          <div className="p-2">
            {activeTab === 'medical' && (
              <CandidateMedicHistory
                reportDate="24th November"
                candidateName={employee.candidate}
              />
            )}
            {activeTab === 'educational' && (
              <CandidateResources resources={educationalResources} />
            )}
            {activeTab === 'schedule' && (
              <CandidateWorkSchedule
                candidateName={employee.candidate}
                placement={employee.placement}
                position={employee.title || 'Not specified'}
              />
            )}
            {activeTab === 'reviews' && (
              <CandidateReview
                candidateId={employee.id}
                candidateName={employee.candidate}
                gender={employee.gender}
                bio={`Meet ${employee.candidate}, a ${employee.gender} domestic staff${employee.title ? ` working as a ${employee.title}` : ''}. ${employee.candidate} is dedicated to providing quality service.`}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCandidateProfile;
