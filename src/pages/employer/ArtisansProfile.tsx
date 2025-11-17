import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  User,
  MapPin,
  Calendar,
  Clock,
  Star,
  FileText,
  Send,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import artisanApi from '../../api/artisanApi';
import contractApi from '../../api/contractApi';
import { calculateAge, extractLocation } from '../../utils/dateUtils';
import Avatar from '../../components/common/Avatar';
import Toast from '../../components/common/Toast';

interface Occupation {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    user_id: number;
    occupation_id: number;
  };
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  // Add other review properties as needed
}

interface Artisan {
  id: number;
  first_name: string;
  last_name: string;
  title: string | null;
  username: string | null;
  email: string;
  email_verified_at: string;
  avatar: string;
  gender: string;
  dob: string;
  phone: string;
  address: string;
  status: number;
  is_verified: number;
  salary: string;
  profile_description: string | null;
  created_at: string;
  updated_at: string;
  average_rating: number | null;
  occupations: Occupation[];
  reviews: Review[];
}

interface ContractFormData {
  start_date: string;
  duration_months: number;
  working_days_per_month: number;
  working_hours_per_week: number;
  working_hours_schedule: string;
  working_hours_start: string;
  working_hours_end: string;
}

const ArtisanProfileView: React.FC = () => {
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  // Contract form data
  const [formData, setFormData] = useState<ContractFormData>({
    start_date: '',
    duration_months: 12, // Default to 12 months
    working_days_per_month: 24, // Default to 24 days
    working_hours_per_week: 40, // Default to 40 hours
    working_hours_schedule: 'mon-fri', // Default to Monday to Friday
    working_hours_start: '09:00',
    working_hours_end: '17:00',
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Extract artisan ID from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const artisanId = queryParams.get('id');

  // Toast helper functions
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  useEffect(() => {
    const fetchArtisanDetails = async () => {
      if (!artisanId) {
        setError('No artisan ID provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await artisanApi.getEmployeeById(Number(artisanId));
        if (response.status && response.data) {
          setArtisan(response.data);
        } else {
          setError(response.message || 'Failed to load artisan details');
        }
      } catch (err: any) {
        console.error('Error fetching artisan details:', err);
        setError(err.message || 'Failed to load artisan details');
      } finally {
        setLoading(false);
      }
    };

    fetchArtisanDetails();
  }, [artisanId]);

  const goBack = () => {
    navigate(-1);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmitProposal = async () => {
    if (!artisan) return;

    try {
      setSubmitting(true);
      setError(null);

      // Prepare the proposal data
      const proposalData = {
        employee_id: artisan.id,
        working_days_per_month: formData.working_days_per_month,
        working_hours_per_week: formData.working_hours_per_week,
        working_hours_schedule: formData.working_hours_schedule,
        start_date: formData.start_date,
        duration_months: formData.duration_months,
        position:
          artisan.occupations && artisan.occupations.length > 0
            ? artisan.occupations[0].name
            : 'professional',
      };

      const response = await contractApi.sendProposal(proposalData);

      if (response.status) {
        showToast('Contract proposal sent successfully!', 'success');
        // Optionally navigate to contracts page after a delay
        setTimeout(() => {
          navigate('/employer/contracts');
        }, 2000);
      } else {
        // Handle error response with data field
        if (response.data && typeof response.data === 'string') {
          showToast(response.data, 'error');
        } else {
          showToast(
            response.message || 'Failed to send contract proposal',
            'error'
          );
        }
      }
    } catch (err: any) {
      // Handle error from API call
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (errorData.data && typeof errorData.data === 'string') {
          showToast(errorData.data, 'error');
        } else {
          showToast(
            errorData.message || 'Error sending contract proposal',
            'error'
          );
        }
      } else {
        showToast(err.message || 'Error sending contract proposal', 'error');
      }
      console.error('Error sending contract proposal:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-0">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : artisan ? (
        <>
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Artisans</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {artisan.first_name}'s Profile
              </h1>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Profile section */}
              <div className="w-full lg:w-1/2 lg:border-r border-gray-200 p-6 sm:p-8 flex flex-col items-center bg-gradient-to-br from-gray-50 to-white">
                <div className="mb-6">
                  <Avatar
                    src={artisan.avatar}
                    firstName={artisan.first_name}
                    lastName={artisan.last_name}
                    size="lg"
                    showStatus={true}
                    isOnline={artisan.status === 1}
                  />
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {artisan.first_name} {artisan.last_name}
                </h2>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{extractLocation(artisan.address)}</span>
                  <span className="text-gray-300">•</span>
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{calculateAge(artisan.dob)} yrs old</span>
                </div>

                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
                  <FileText className="w-4 h-4" />
                  {artisan.occupations && artisan.occupations.length > 0
                    ? artisan.occupations[0].name.charAt(0).toUpperCase() +
                      artisan.occupations[0].name.slice(1)
                    : 'Professional'}
                </div>

                <div className="flex items-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= (artisan.average_rating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  {artisan.average_rating && (
                    <span className="ml-2 text-sm font-medium text-gray-600">
                      ({artisan.average_rating.toFixed(1)})
                    </span>
                  )}
                </div>

                <div className="w-full max-w-md">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      About
                    </h3>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-lg p-4">
                    {artisan.profile_description ? (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {artisan.profile_description}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Meet {artisan.first_name} {artisan.last_name}, a
                        passionate{' '}
                        {artisan.occupations && artisan.occupations.length > 0
                          ? artisan.occupations[0].name
                          : 'professional'}{' '}
                        from {extractLocation(artisan.address)}. With a love for{' '}
                        {artisan.occupations && artisan.occupations.length > 0
                          ? artisan.occupations[0].name
                          : 'their profession'}{' '}
                        that knows no bounds, {artisan.first_name} brings
                        dedication and skill to every task. From traditional
                        techniques to innovative approaches, this talented
                        professional is dedicated to delivering exceptional
                        quality and service.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Employment Form */}
              <div className="w-full lg:w-1/2 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Employment Form
                  </h3>
                </div>

                <div className="space-y-5">
                  {/* Employment Start Date */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Employment Start Date
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      value={formData.start_date}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Employment Period */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Employment Period
                    </label>
                    <div className="relative">
                      <select
                        name="duration_months"
                        className="appearance-none w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white"
                        value={formData.duration_months}
                        onChange={handleInputChange}
                      >
                        <option value="">Select period</option>
                        <option value="1">1 month</option>
                        <option value="2">2 months</option>
                        <option value="3">3 months</option>
                        <option value="4">4 months</option>
                        <option value="5">5 months</option>
                        <option value="6">6 months</option>
                        <option value="7">7 months</option>
                        <option value="8">8 months</option>
                        <option value="9">9 months</option>
                        <option value="10">10 months</option>
                        <option value="11">11 months</option>
                        <option value="12">12 months</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Working Hours - Start */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      Working Hours (Start)
                    </label>
                    <div className="relative">
                      <select
                        name="working_hours_start"
                        className="appearance-none w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white"
                        value={formData.working_hours_start}
                        onChange={handleInputChange}
                      >
                        <option value="">Select start time</option>
                        <option value="08:00">8:00 AM</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Working Hours - End */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      Working Hours (End)
                    </label>
                    <div className="relative">
                      <select
                        name="working_hours_end"
                        className="appearance-none w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white"
                        value={formData.working_hours_end}
                        onChange={handleInputChange}
                      >
                        <option value="">Select end time</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                        <option value="18:00">6:00 PM</option>
                        <option value="19:00">7:00 PM</option>
                        <option value="20:00">8:00 PM</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Hidden fields for API compatibility */}
                  <input
                    type="hidden"
                    name="working_days_per_month"
                    value={formData.working_days_per_month}
                  />
                  <input
                    type="hidden"
                    name="working_hours_per_week"
                    value={formData.working_hours_per_week}
                  />
                  <input
                    type="hidden"
                    name="working_hours_schedule"
                    value={formData.working_hours_schedule}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSubmitProposal}
                    disabled={submitting || !formData.start_date}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Sending Proposal...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Proposal</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            No artisan found
          </p>
          <p className="text-sm text-gray-500">
            No artisan found with the provided ID.
          </p>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={4000}
      />
    </div>
  );
};

export default ArtisanProfileView;
