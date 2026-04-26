import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Search,
  X,
  Plus,
  MapPin,
  Phone,
  Briefcase,
  Shield,
  Loader2,
  Building2,
} from 'lucide-react';
import agentApi from '../../api/agentApi';
import ArtisanImg from '../../assets/images/artisans.png';

import CandidateProfileAbout from '../../components/Agent/CandidateProfileAbout';
import CandidateMedicHistory from '../../components/Agent/CandidateMedicHistory';
import CandidateResources from '../../components/Agent/CandidateResources';
import CandidateWorkSchedule from '../../components/Agent/CandidateWorkSchedule';
import CandidateReview from '../../components/Agent/CandidateReview';
import Toast from '../../components/common/Toast';
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
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(
    null
  );
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
        showToast(
          `Successfully suggested ${employee.candidate} to ${selectedEmployer.first_name} ${selectedEmployer.last_name}`,
          'success'
        );
        setIsAssignModalOpen(false);
        setSelectedEmployer(null);
        setSearchQuery('');
        setSuggestionReason('');
      } else {
        showToast(response.message || 'Failed to create suggestion', 'error');
      }
    } catch (err: any) {
      console.error('Error creating suggestion:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to create suggestion';
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
          const errorMessage =
            response.message || 'Failed to fetch employee details';
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
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="p-6">
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Failed to load employee details
        </div>
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      </div>
    );
  }

  const candidateName = employee.candidate || 'Candidate';
  const placementDisplay = employee.placement || 'Not assigned';
  const primaryRole = employee.occupation || employee.title || 'Domestic Staff';
  const employerCount = employee.employers?.length || 0;
  const reviewCount = employee.reviews?.length || 0;
  const averageRating =
    reviewCount > 0
      ? (
          employee.reviews.reduce(
            (sum: number, review: any) => sum + (review.rating || 0),
            0
          ) / reviewCount
        ).toFixed(1)
      : '4.0';
  const isCandidateVerified =
    employee.status &&
    !employee.status.toLowerCase().includes('not') &&
    employee.status.toLowerCase() !== 'unverified';

  const quickStats: Array<{
    label: string;
    value: string;
    subValue?: string;
    icon: React.ElementType;
    iconClass: string;
  }> = [
    {
      label: 'Current Placement',
      value: placementDisplay,
      icon: MapPin,
      iconClass: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Primary Role',
      value: primaryRole,
      icon: Briefcase,
      iconClass: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Contact',
      value: employee.phone || 'Not provided',
      subValue: employee.email || 'No email on file',
      icon: Phone,
      iconClass: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Employers Assigned',
      value: employerCount > 0 ? `${employerCount} connected` : 'None yet',
      icon: Users,
      iconClass: 'bg-orange-50 text-orange-600',
    },
  ];

  const tabs = [
    { id: 'medical', label: 'Medical History' },
    { id: 'educational', label: 'Educational Resources' },
    { id: 'schedule', label: 'Work Schedule' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <div className="p-0 space-y-6">
      <div className="space-y-4">
        <button
          onClick={goBack}
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Candidates
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Candidate Profile
              </p>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {candidateName}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Comprehensive overview of placement, health, learning, and
                performance data
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-end">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                isCandidateVerified
                  ? 'bg-green-50 text-green-700'
                  : 'bg-orange-50 text-orange-700'
              }`}
            >
              <Shield className="w-4 h-4" />
              {isCandidateVerified ? 'Verified Candidate' : 'Pending Review'}
            </span>
            <button
              onClick={() => {
                setIsAssignModalOpen(true);
                fetchEmployers();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Suggest to Employer
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {quickStats.map(({ label, value, subValue, icon: Icon, iconClass }) => (
          <div
            key={label}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconClass}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                {label}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {value}
              </p>
              {subValue && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {subValue}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
            <CandidateProfileAbout
              name={employee.candidate}
              location={placementDisplay}
              age={0}
              role={primaryRole}
              bio={`${employee.candidate} is a ${employee.gender} ${primaryRole.toLowerCase()} currently placed with ${placementDisplay}.`}
              phone={employee.phone}
              email={employee.email}
              profileImage={employee.avatar || ArtisanImg}
              rating={Number(averageRating)}
              onAssignEmployer={() => {
                setIsAssignModalOpen(true);
                fetchEmployers();
              }}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Assigned Employers
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {employerCount > 0
                    ? 'Employers currently connected to this candidate'
                    : 'No employers assigned yet'}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                <Building2 className="w-4 h-4 text-gray-400" />
                {employerCount}
              </span>
            </div>
            <div className="space-y-3">
              {employerCount > 0 ? (
                employee.employers.map((employer) => (
                  <div
                    key={employer.id}
                    className="p-3 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-1"
                  >
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {employer.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Employer ID: {employer.id}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Once you suggest the candidate to an employer, their details
                  will appear here.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Performance Snapshot
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl font-semibold">
                {averageRating}
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Average Rating
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {averageRating}
                  <span className="text-sm font-medium text-gray-400 ml-1">
                    ({reviewCount} reviews)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3 space-y-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
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
                bio={`Meet ${employee.candidate}, a ${employee.gender} ${
                  primaryRole.toLowerCase() || 'domestic staff'
                }${
                  employee.title ? ` working as a ${employee.title}` : ''
                }. Currently placed with ${placementDisplay}. ${
                  employee.candidate
                } is dedicated to providing quality service.`}
                reviews={employee.reviews}
              />
            )}
          </div>
        </div>
      </div>

      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsAssignModalOpen(false)}
          />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg border border-gray-100 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Suggest to Employer
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Connect {candidateName} with a potential employer
                </p>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 dark:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Employer
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search employers"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {selectedEmployer && (
                    <div className="mt-3 p-3 rounded-lg border border-gray-100 bg-gray-50 relative">
                      <button
                        type="button"
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-400"
                        onClick={() => setSelectedEmployer(null)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="font-semibold text-gray-900 dark:text-gray-100 pr-6">
                        {selectedEmployer.first_name}{' '}
                        {selectedEmployer.last_name}
                      </div>
                      {selectedEmployer.company_name && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedEmployer.company_name}
                        </div>
                      )}
                      <div className="text-xs text-gray-400">
                        {selectedEmployer.email}
                      </div>
                    </div>
                  )}

                  {searchQuery && !selectedEmployer && (
                    <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-64 overflow-auto">
                      {isLoadingEmployers ? (
                        <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                          Loading employers...
                        </div>
                      ) : filteredEmployers.length > 0 ? (
                        filteredEmployers.map((employer) => (
                          <button
                            key={employer.id}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            onClick={() => handleEmployerSelect(employer)}
                          >
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {employer.first_name} {employer.last_name}
                            </div>
                            {employer.company_name && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {employer.company_name}
                              </div>
                            )}
                            <div className="text-xs text-gray-400">
                              {employer.email}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                          No employers found matching your search
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Suggestion Reason
                </label>
                <textarea
                  placeholder="Explain why you're suggesting this candidate to the employer..."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                  rows={3}
                  value={suggestionReason}
                  onChange={(e) => setSuggestionReason(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignEmployer}
                  disabled={
                    !selectedEmployer || !suggestionReason.trim() || isAssigning
                  }
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isAssigning ? 'Suggesting...' : 'Send Suggestion'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
