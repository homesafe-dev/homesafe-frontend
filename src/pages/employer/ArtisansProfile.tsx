import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiChevronDown } from 'react-icons/fi';
import ArtisanImg from '../../assets/images/artisans.png';
import { useNavigate, useLocation } from 'react-router-dom';
import artisanApi from '../../api/artisanApi';
import contractApi from '../../api/contractApi';
import { calculateAge, extractLocation } from '../../utils/dateUtils';

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      setSuccessMessage(null);

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
        setSuccessMessage('Contract proposal sent successfully!');
        // Optionally navigate to contracts page or show a success modal
      } else {
        // Handle error response with data field
        if (response.data && typeof response.data === 'string') {
          setError(response.data);
        } else {
          setError(response.message || 'Failed to send contract proposal');
        }
      }
    } catch (err: any) {
      // Handle error from API call
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (errorData.data && typeof errorData.data === 'string') {
          setError(errorData.data);
        } else {
          setError(errorData.message || 'Error sending contract proposal');
        }
      } else {
        setError(err.message || 'Error sending contract proposal');
      }
      console.error('Error sending contract proposal:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : artisan ? (
        <>
          <div className="flex items-center mb-8">
            <button
              onClick={goBack}
              className="flex items-center text-semibold text-[20px] text-[#24292E] hover:text-gray-900"
            >
              <FiArrowLeft className="mr-2" />
              <span>{artisan.first_name}'s Profile</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 bg-white shadow-sm p-8 rounded-[16px]">
            {/* Profile section */}
            <div className="w-full lg:w-1/2 border-r border-[#BDC2C7] p-6 flex flex-col items-center relative">
              <div className="relative mb-4">
                <img
                  src={artisan.avatar || ArtisanImg}
                  alt={`${artisan.first_name} ${artisan.last_name}`}
                  className="rounded-full w-24 h-24 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/100';
                  }}
                />
                <div
                  className={`absolute top-1 right-1 w-4 h-4 border-2 border-white rounded-full ${
                    artisan.status === 1 ? 'bg-[#37A379]' : 'bg-gray-400'
                  }`}
                />
              </div>

              <h2 className="text-[16px] text-gray-700 mt-[1rem] font-medium">
                {artisan.first_name} {artisan.last_name}
              </h2>
              <p className="text-[13px] mt-[0.5rem] text-[#24292E] mb-2">
                {extractLocation(artisan.address)} | {calculateAge(artisan.dob)}{' '}
                yrs old
              </p>

              <div className="bg-[#C8EDDF80] mt-[0.5rem] text-[#48525B] px-3 py-1 rounded-[8px] text-[13px] mb-2">
                {artisan.occupations && artisan.occupations.length > 0
                  ? artisan.occupations[0].name.charAt(0).toUpperCase() +
                    artisan.occupations[0].name.slice(1)
                  : 'Professional'}
              </div>

              <div className="flex mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-yellow-400 mt-[0.5rem] ${
                      star <= (artisan.average_rating || 0)
                        ? 'opacity-100'
                        : 'opacity-30'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <div className="mb-6 w-full">
                <h3 className="text-[#246D51] text-[16px] font-semibold mb-2">
                  About me
                </h3>
                {artisan.profile_description ? (
                  <p className="text-[13px] text-[#48525B]">
                    {artisan.profile_description}
                  </p>
                ) : (
                  <p className="text-[13px] text-[#48525B]">
                    Meet {artisan.first_name} {artisan.last_name}, a passionate{' '}
                    {artisan.occupations && artisan.occupations.length > 0
                      ? artisan.occupations[0].name
                      : 'professional'}{' '}
                    from {extractLocation(artisan.address)}. With a love for{' '}
                    {artisan.occupations && artisan.occupations.length > 0
                      ? artisan.occupations[0].name
                      : 'their profession'}{' '}
                    that knows no bounds, {artisan.first_name} brings dedication
                    and skill to every task. From traditional techniques to
                    innovative approaches, this talented professional is
                    dedicated to delivering exceptional quality and service.
                  </p>
                )}
              </div>
            </div>

            {/* Employment Form */}
            <div className="w-full lg:w-1/2 ">
              <h3 className="text-[#246D51] text-[16px] font-semibold mb-6">
                Employment Form
              </h3>

              <div className="space-y-6 border border-gray-100 p-8 rounded-[16px]">
                {/* Employment Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Employment Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="start_date"
                      placeholder="MM/DD/YYYY"
                      className="w-full border h-[50px] border-gray-100 rounded p-3 pr-10 focus:outline-none focus:ring-1 focus:ring-gray-400"
                      value={formData.start_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Employment Period */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Employment Period
                  </label>
                  <div className="relative">
                    <select
                      name="duration_months"
                      className="appearance-none w-full border h-[50px] border-gray-100 rounded p-3 pr-10 focus:outline-none focus:ring-1 focus:ring-gray-400"
                      value={formData.duration_months}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="3">3 months</option>
                      <option value="6">6 months</option>
                      <option value="12">12 months</option>
                      <option value="24">24 months</option>
                      <option value="36">36 months</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>

                {/* Working Hours - Start */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Working Hours
                  </label>
                  <div className="relative">
                    <select
                      name="working_hours_start"
                      className="appearance-none w-full border h-[50px] border-gray-100 rounded p-3 pr-10 focus:outline-none focus:ring-1 focus:ring-gray-400"
                      value={formData.working_hours_start}
                      onChange={handleInputChange}
                    >
                      <option value="">Start</option>
                      <option value="08:00">8:00 AM</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>

                {/* Working Hours - End */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Working Hours
                  </label>
                  <div className="relative">
                    <select
                      name="working_hours_end"
                      className="appearance-none w-full border h-[50px] border-gray-100 rounded p-3 pr-10 focus:outline-none focus:ring-1 focus:ring-gray-400"
                      value={formData.working_hours_end}
                      onChange={handleInputChange}
                    >
                      <option value="">End</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                      <option value="19:00">7:00 PM</option>
                      <option value="20:00">8:00 PM</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
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
            </div>
          </div>

          {/* Success or Error message */}
          {(successMessage || (error && !loading)) && (
            <div
              className={`px-4 py-3 rounded mb-4 mt-4 ${
                successMessage
                  ? 'bg-green-100 border border-green-400 text-green-700'
                  : 'bg-red-100 border border-red-400 text-red-700'
              }`}
            >
              {successMessage || error}
            </div>
          )}

          <div className="ml-auto w-[143px]">
            <button
              onClick={handleSubmitProposal}
              disabled={submitting || !formData.start_date}
              className="bg-[#A5EA91] hover:bg-green-500 text-green-800 py-2 rounded-md text-sm ml-auto mt-[1rem] transition-colors w-[143px] h-[42px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-700 mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Hire Me'
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No artisan found with the provided ID.
        </div>
      )}
    </div>
  );
};

export default ArtisanProfileView;
