import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import agentApi from '../../api/agentApi';
import ArtisanImg from '../../assets/images/artisans.png';

// Import components
import CandidateProfileAbout from '../../components/Agent/CandidateProfileAbout';
import CandidateMedicHistory from '../../components/Agent/CandidateMedicHistory';
import CandidateResources from '../../components/Agent/CandidateResources';
import CandidateWorkSchedule from '../../components/Agent/CandidateWorkSchedule';
import CandidateReview from '../../components/Agent/CandidateReview';
import Toast from '../../components/common/Toast';
import { FiSearch, FiX } from 'react-icons/fi';
import userApi from '../../api/userApi';
import suggestionsApi from '../../api/suggestionsApi';

interface Employee {
  id: number;
  candidate: string;
  title: string | null;
  email: string;
  avatar: string | null;
  date: string;
  placement: string;
  gender: string;
  phone: string;
  status: string;
  occupation: string;
  employers: {
    id: number;
    name: string;
  }[];
  user_medicals: {
    id: number;
    medical_file: string;
    date_uploaded: string;
  }[];
  reviews: {
    id: number;
    rating: number;
    comment: string;
    date: string;
    reviewer: {
      first_name: string;
      last_name: string;
      title?: string | null;
      email: string;
      avatar?: string;
    };
  }[];
}

interface Employer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  company_name?: string;
  avatar?: string;
}

const CandidateProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('medical');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
    isVisible: false,
  });

  // Toast helper functions
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  // Assignment modal state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingEmployers, setIsLoadingEmployers] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [suggestionReason, setSuggestionReason] = useState('');

  // Fetch employers for assignment
  const fetchEmployers = async () => {
    try {
      setIsLoadingEmployers(true);
      const response = await userApi.getEmployerList(1, 50);

      if (response.status) {
        const employerData =
          response.data?.data?.data ||
          response.data?.data ||
          response.data ||
          [];
        setEmployers(employerData);
      } else {
        const errorMessage = response.message || 'Failed to fetch employers';
        showToast(errorMessage, 'error');
      }
    } catch (err: any) {
      console.error('Error fetching employers:', err);
      showToast('An error occurred while fetching employers', 'error');
    } finally {
      setIsLoadingEmployers(false);
    }
  };

  // Handle employer suggestion
  const handleAssignEmployer = async () => {
    if (!selectedEmployer) {
      showToast('Please select an employer', 'error');
      return;
    }

    if (!suggestionReason.trim()) {
      showToast('Please provide a reason for the suggestion', 'error');
      return;
    }

    if (!employee) {
      showToast('Employee data not available', 'error');
      return;
    }

    try {
      setIsAssigning(true);

      const suggestionData = {
        employee_id: employee.id,
        employer_id: selectedEmployer.id,
        suggestion_reason: suggestionReason.trim(),
      };

      const response = await suggestionsApi.createSuggestion(suggestionData);

      if (response.status) {
        showToast(`Successfully suggested ${employee.candidate} to ${selectedEmployer.first_name} ${selectedEmployer.last_name}`, 'success');
        setIsAssignModalOpen(false);
        setSelectedEmployer(null);
        setSearchQuery('');
        setSuggestionReason('');
      } else {
        showToast(response.message || 'Failed to create suggestion', 'error');
      }
    } catch (err: any) {
      console.error('Error creating suggestion:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create suggestion';
      showToast(errorMessage, 'error');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleEmployerSelect = (employer: Employer) => {
    setSelectedEmployer(employer);
    setSearchQuery('');
  };

  const filteredEmployers = searchQuery
    ? employers.filter(
        (employer) =>
          `${employer.first_name} ${employer.last_name}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (employer.company_name &&
            employer.company_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          employer.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : employers;

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!id) {
        const errorMessage = 'No employee ID provided';
        setError(errorMessage);
        showToast(errorMessage, 'error');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await agentApi.getTrackedEmployees();
        if (response.status) {
          const foundEmployee = response.data.find(
            (emp: Employee) => emp.id === Number(id)
          );
          if (foundEmployee) {
            setEmployee(foundEmployee);
          } else {
            const errorMessage = 'Employee not found';
            setError(errorMessage);
            showToast(errorMessage, 'error');
          }
        } else {
          const errorMessage = response.message || 'Failed to fetch employee details';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        }
      } catch (err: any) {
        console.error('Error fetching employee details:', err);
        const errorMessage = err.message || 'Failed to fetch employee details';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [id]);

  const goBack = () => {
    navigate(-1);
  };

  // Sample educational resources data
  const educationalResources = [
    {
      title: 'Best Practices for Domestic Staff',
      startDate: '24th Nov, 2024',
      description:
        'A comprehensive guide on best practices for domestic staff, covering etiquette, safety, and professional conduct.',
      chapterCount: 12,
      recipeCount: 0,
      thumbnail: '/path-to-thumbnail.jpg',
    },
    {
      title: 'Home Safety Guidelines',
      startDate: '24th Nov, 2024',
      description:
        'Essential safety guidelines for domestic staff to ensure a safe working environment.',
      chapterCount: 8,
      recipeCount: 0,
      thumbnail: '/path-to-thumbnail.jpg',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="p-6">
        <div className="text-center py-8 text-gray-500">
          Failed to load employee details
        </div>
        {/* Toast Notification */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      </div>
    );
  }

  // Format candidate name for display
  const candidateName = employee.candidate || 'Candidate';

  return (
    <div className="rounded-lg">
      <div className="p-3 sm:p-4 border-b border-gray-100">
        <button className="flex items-center text-gray-600" onClick={goBack}>
          <FaArrowLeft className="mr-2" />
          <span className="text-sm sm:text-base">
            {candidateName}'s Profile
          </span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* Left panel */}
        <div className="w-full lg:w-1/3 lg:border-r bg-white border-gray-100 p-4 sm:p-6 shadow-md">
          <CandidateProfileAbout
            name={employee.candidate}
            location={employee.placement || 'Not assigned'}
            age={0} // Age not available in the API response
            role={employee.occupation || employee.title || 'Domestic Staff'}
            bio={`${employee.candidate} is a ${employee.gender} ${employee.occupation || 'domestic staff'} currently placed with ${employee.placement}.`}
            phone={employee.phone}
            email={employee.email}
            profileImage={employee.avatar || ArtisanImg}
            rating={
              employee.reviews.length > 0
                ? employee.reviews.reduce(
                    (sum: number, review: any) => sum + (review.rating || 0),
                    0
                  ) / employee.reviews.length
                : 4.0
            }
            onAssignEmployer={() => {
              setIsAssignModalOpen(true);
              fetchEmployers();
            }}
          />
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-2/3">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              className={`px-3 sm:px-4 py-3 text-sm whitespace-nowrap ${activeTab === 'medical' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('medical')}
            >
              Medical History
            </button>
            <button
              className={`px-3 sm:px-4 py-3 text-sm whitespace-nowrap ${activeTab === 'educational' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('educational')}
            >
              Educational Resources
            </button>
            <button
              className={`px-3 sm:px-4 py-3 text-sm whitespace-nowrap ${activeTab === 'schedule' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('schedule')}
            >
              Work Schedule
            </button>
            <button
              className={`px-3 sm:px-4 py-3 text-sm whitespace-nowrap ${activeTab === 'reviews' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Review
            </button>
          </div>

          {/* Tab content */}
          <div className="p-2">
            {activeTab === 'medical' && (
              <CandidateMedicHistory
                medicalFiles={employee.user_medicals}
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
                bio={`Meet ${employee.candidate}, a ${employee.gender} ${employee.occupation || 'domestic staff'}${employee.title ? ` working as a ${employee.title}` : ''}. Currently placed with ${employee.placement}. ${employee.candidate} is dedicated to providing quality service.`}
                reviews={employee.reviews}
              />
            )}
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsAssignModalOpen(false)}></div>
          <div className="bg-white rounded-lg w-full max-w-md relative z-10 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium">Suggest to Employer</h2>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Search Employer</label>
                <div className="relative">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search employers"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {selectedEmployer && (
                    <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg relative">
                      <button
                        type="button"
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        onClick={() => setSelectedEmployer(null)}
                      >
                        <FiX size={18} />
                      </button>
                      <div className="font-medium pr-6">
                        {selectedEmployer.first_name} {selectedEmployer.last_name}
                      </div>
                      {selectedEmployer.company_name && (
                        <div className="text-sm text-gray-500">
                          {selectedEmployer.company_name}
                        </div>
                      )}
                      <div className="text-xs text-gray-400">
                        {selectedEmployer.email}
                      </div>
                    </div>
                  )}

                  {searchQuery && !selectedEmployer && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {isLoadingEmployers ? (
                        <div className="p-4 text-center text-gray-500">
                          Loading employers...
                        </div>
                      ) : filteredEmployers.length > 0 ? (
                        filteredEmployers.map((employer) => (
                          <div
                            key={employer.id}
                            className="p-3 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleEmployerSelect(employer)}
                          >
                            <div className="font-medium">
                              {employer.first_name} {employer.last_name}
                            </div>
                            {employer.company_name && (
                              <div className="text-sm text-gray-500">
                                {employer.company_name}
                              </div>
                            )}
                            <div className="text-xs text-gray-400">
                              {employer.email}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No employers found matching your search
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Suggestion Reason</label>
                <textarea
                  placeholder="Explain why you're suggesting this employee to the employer..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
                  rows={3}
                  value={suggestionReason}
                  onChange={(e) => setSuggestionReason(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignEmployer}
                  disabled={!selectedEmployer || !suggestionReason.trim() || isAssigning}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isAssigning ? 'Suggesting...' : 'Suggest'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default CandidateProfile;
