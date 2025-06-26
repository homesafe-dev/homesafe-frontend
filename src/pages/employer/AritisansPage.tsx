import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import artisanApi from '../../api/artisanApi';

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

const ArtisansPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [itemsPerPage] = useState<number>(15);

  useEffect(() => {
    const fetchArtisans = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await artisanApi.getEmployeeList(
          currentPage,
          itemsPerPage
        );

        console.log('Artisans API Response:', response); // Debug log

        if (response.status && response.data) {
          // Handle the new paginated response structure
          const artisanData = response.data?.data || response.data || [];
          console.log('Extracted artisan data:', artisanData); // Debug log

          setArtisans(artisanData);
          setTotalPages(response.data?.last_page || 1);
        } else {
          setError(response.message || 'Failed to load artisans');
        }
      } catch (err: any) {
        console.error('Error fetching artisans:', err);
        setError(err.message || 'Failed to load artisans');
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, [currentPage, itemsPerPage]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-yellow-400 text-lg ${i <= rating ? 'opacity-100' : 'opacity-30'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Function to extract location from address
  const extractLocation = (address: string | null): string => {
    if (!address) return 'Unknown';

    // Try to extract city from address
    const parts = address.split(',');
    if (parts.length > 1) {
      return parts[1].trim();
    }

    // If no comma, return first few words
    const words = address.split(' ');
    return words.slice(0, 2).join(' ');
  };

  // Calculate age from date of birth
  const getAge = (dob: string | null): number => {
    if (!dob) return 0;

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Get occupation name or default to "Professional"
  const getOccupation = (artisan: Artisan): string => {
    if (artisan.occupations && artisan.occupations.length > 0) {
      return (
        artisan.occupations[0].name.charAt(0).toUpperCase() +
        artisan.occupations[0].name.slice(1)
      );
    }
    return 'Professional';
  };

  // Get rating or default to 0
  const getRating = (artisan: Artisan): number => {
    return artisan.average_rating || 0;
  };

  // Filter artisans based on search query
  const filteredArtisans = artisans.filter((artisan) => {
    const fullName = `${artisan.first_name} ${artisan.last_name}`.toLowerCase();
    const occupation =
      artisan.occupations && artisan.occupations.length > 0
        ? artisan.occupations[0].name.toLowerCase()
        : '';
    const location = extractLocation(artisan.address).toLowerCase();
    const query = searchQuery.toLowerCase();

    return (
      fullName.includes(query) ||
      occupation.includes(query) ||
      location.includes(query)
    );
  });

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="px-6 py-6">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold text-[#24292E] mb-4">
            Artisans
          </h1>

          <div className="relative mb-6 w-[335px] h-[42px] max-w-md ml-auto">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, occupation or location"
              className="w-full pl-10 pr-4 py-2 border border-gray-100 rounded-[16px] text-[16px] text-[#5A6672] focus:outline-none focus:ring-1 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <p className="text-[13px] text-[#24292E] mb-6">
          List of available artisans
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : filteredArtisans.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No artisans found matching your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            {filteredArtisans.map((artisan) => (
              <div
                key={artisan.id}
                className="flex flex-col items-center bg-white p-8 shadow"
              >
                <div className="mb-3 relative">
                  <img
                    src={artisan.avatar || 'https://via.placeholder.com/150'}
                    alt={`${artisan.first_name} ${artisan.last_name}`}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div
                    className={`absolute top-1 right-1 w-4 h-4 border-2 border-white rounded-full ${
                      artisan.status === 1 ? 'bg-[#37A379]' : 'bg-gray-400'
                    }`}
                  />
                </div>
                <h3 className="font-medium text-center text-[16px] text-[#24292E] mt-[1rem]">
                  {artisan.first_name} {artisan.last_name}
                </h3>
                <p className="text-sm text-gray-500 mb-1 mt-[0.5rem]">
                  {extractLocation(artisan.address)} | {getAge(artisan.dob)} yrs
                  old
                </p>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs mb-2 mt-[0.5rem]">
                  {getOccupation(artisan)}
                </div>
                <div className="flex mb-3">
                  {renderStars(getRating(artisan))}
                </div>
                <Link
                  to={`/employer/artisan/profile?id=${artisan.id}`}
                  className="w-full"
                >
                  <button className="bg-[#A5EA91] hover:bg-green-300 text-[#24292E] px-4 py-2 rounded-md text-sm transition-colors w-full text-center mt-[1rem] cursor-pointer">
                    View Profile
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentPage === page ? 'bg-gray-200' : 'hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisansPage;
