import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiCalendar } from 'react-icons/fi';
import ArtisanImg from '../../assets/images/artisans.png';
import { useNavigate, useLocation } from 'react-router-dom';
import artisanApi from '../../api/artisanApi';
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

const ArtisanProfileView: React.FC = () => {
  const [employmentStartDate, setEmploymentStartDate] = useState('');
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        console.error("Error fetching artisan details:", err);
        setError(err.message || "Failed to load artisan details");
      } finally {
        setLoading(false);
      }
    };

    fetchArtisanDetails();
  }, [artisanId]);

  const goBack = () => {
    navigate(-1);
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
                {extractLocation(artisan.address)} | {calculateAge(artisan.dob)} yrs old
              </p>

              <div className="bg-[#C8EDDF80] mt-[0.5rem] text-[#48525B] px-3 py-1 rounded-[8px] text-[13px] mb-2">
                {artisan.occupations && artisan.occupations.length > 0
                  ? artisan.occupations[0].name.charAt(0).toUpperCase() + artisan.occupations[0].name.slice(1)
                  : "Professional"}
              </div>

              <div className="flex mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-yellow-400 mt-[0.5rem] ${
                      star <= (artisan.average_rating || 0) ? 'opacity-100' : 'opacity-30'
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
                    Meet {artisan.first_name} {artisan.last_name}, a passionate {
                      artisan.occupations && artisan.occupations.length > 0
                        ? artisan.occupations[0].name
                        : "professional"
                    } from {extractLocation(artisan.address)}.
                    With a love for {
                      artisan.occupations && artisan.occupations.length > 0
                        ? artisan.occupations[0].name
                        : "their profession"
                    } that knows no bounds, {artisan.first_name} brings dedication and skill to every task.
                    From traditional techniques to innovative approaches, this talented professional is dedicated to
                    delivering exceptional quality and service.
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
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Employment Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      placeholder="MM/DD/YYYY"
                      className="w-full border h-[50px] border-gray-100 rounded p-3 pr-10 focus:outline-none focus:ring-1 focus:ring-gray-400"
                      value={employmentStartDate}
                      onChange={(e) => setEmploymentStartDate(e.target.value)}
                    />
                    <FiCalendar className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ml-auto w-[143px]">
            <button className="bg-[#A5EA91] hover:bg-green-500 text-green-800 py-2 rounded-md text-sm ml-auto mt-[1rem] transition-colors w-[143px] h-[42px">
              Hire Me
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
