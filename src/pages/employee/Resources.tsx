import React, { useState, useEffect } from 'react';
import { FiMoreVertical, FiShare2, FiDownload, FiSearch } from 'react-icons/fi';
import ShareModal from '../../components/Employer/ResourceShareModal';
import resourcesApi from '../../api/resourcesApi';

// Helper function to extract YouTube video ID from URL
const getYoutubeVideoId = (url: string): string => {
  try {
    // Handle different YouTube URL formats
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : '';
  } catch (error) {
    console.error('Error extracting YouTube video ID:', error);
    return '';
  }
};

// Define the resource type based on API response
interface Resource {
  id: number;
  occupation_id: number;
  video_link: string;
  description: string;
  occupation: {
    id: number;
    name: string;
  };
}

// Define pagination metadata type
interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

const ResourcesPage: React.FC = () => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );

  // Fetch resources from API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await resourcesApi.getLearningResources(currentPage);
        if (response.status) {
          setResources(response.data.data);
          setPaginationMeta(response.data.meta);
        } else {
          setError('Failed to fetch resources');
        }
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('An error occurred while fetching resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [currentPage]);

  const toggleMenu = (id: number) => {
    setActiveMenuId(activeMenuId === id.toString() ? null : id.toString());
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDownload = () => {
    setActiveMenuId(null);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  React.useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenuId(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold">Resources</h1>
          <div className="flex items-center w-full sm:w-auto">
            <div className="relative rounded-[16px] border border-gray-100 px-4 py-2 flex items-center w-full sm:w-[320px] md:w-[480px]">
              <FiSearch className="text-gray-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search for video, link"
                className="bg-transparent outline-none w-full text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="rounded-lg overflow-hidden bg-white p-2 shadow-sm border border-gray-50"
                >
                  <div className="relative">
                    <img
                      src={`https://img.youtube.com/vi/${getYoutubeVideoId(resource.video_link)}/hqdefault.jpg`}
                      alt={`${resource.occupation.name} resource`}
                      className="w-full h-40 sm:h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x200';
                      }}
                    />
                  </div>

                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-start relative">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate pr-2">
                        {resource.occupation.name.charAt(0).toUpperCase() +
                          resource.occupation.name.slice(1)}{' '}
                        Training
                      </h3>
                      <button
                        className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(resource.id);
                        }}
                      >
                        <FiMoreVertical />
                      </button>
                      {activeMenuId === resource.id.toString() && (
                        <div
                          className="absolute top-8 right-0 bg-white rounded-md shadow-lg overflow-hidden z-10 w-36"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div
                            className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer"
                            onClick={handleShare}
                          >
                            <FiShare2 className="mr-2" />
                            Share
                          </div>
                          <div
                            className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer"
                            onClick={handleDownload}
                          >
                            <FiDownload className="mr-2" />
                            Download
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="mt-2 text-xs sm:text-sm text-gray-600 line-clamp-2">
                      {resource.description}
                    </p>

                    <div className="mt-3 sm:mt-4 flex justify-between items-center">
                      <a
                        href={resource.video_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 text-xs sm:text-sm hover:underline"
                      >
                        Watch Video
                      </a>
                      <div className="px-2 py-1 text-xs rounded-md bg-orange-100 text-orange-800">
                        Video
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {paginationMeta && (
              <div className="flex justify-center mt-6 sm:mt-8">
                <nav className="flex items-center space-x-1 sm:space-x-2">
                  <button
                    onClick={() =>
                      handlePageChange(paginationMeta.current_page - 1)
                    }
                    disabled={paginationMeta.current_page === 1}
                    className={`px-2 sm:px-3 py-1 rounded text-sm ${
                      paginationMeta.current_page === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </button>

                  {/* Show limited page numbers on mobile */}
                  {paginationMeta.last_page <= 5 ? (
                    Array.from(
                      { length: paginationMeta.last_page },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-2 sm:px-3 py-1 rounded text-sm ${
                          page === paginationMeta.current_page
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))
                  ) : (
                    <>
                      {/* Show current page and adjacent pages on mobile */}
                      {paginationMeta.current_page > 2 && (
                        <>
                          <button
                            onClick={() => handlePageChange(1)}
                            className="px-2 sm:px-3 py-1 rounded text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
                          >
                            1
                          </button>
                          {paginationMeta.current_page > 3 && (
                            <span className="px-1 text-gray-500">...</span>
                          )}
                        </>
                      )}

                      {[
                        paginationMeta.current_page - 1,
                        paginationMeta.current_page,
                        paginationMeta.current_page + 1,
                      ]
                        .filter(
                          (page) =>
                            page >= 1 && page <= paginationMeta.last_page
                        )
                        .map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-2 sm:px-3 py-1 rounded text-sm ${
                              page === paginationMeta.current_page
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                      {paginationMeta.current_page <
                        paginationMeta.last_page - 1 && (
                        <>
                          {paginationMeta.current_page <
                            paginationMeta.last_page - 2 && (
                            <span className="px-1 text-gray-500">...</span>
                          )}
                          <button
                            onClick={() =>
                              handlePageChange(paginationMeta.last_page)
                            }
                            className="px-2 sm:px-3 py-1 rounded text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
                          >
                            {paginationMeta.last_page}
                          </button>
                        </>
                      )}
                    </>
                  )}

                  <button
                    onClick={() =>
                      handlePageChange(paginationMeta.current_page + 1)
                    }
                    disabled={
                      paginationMeta.current_page === paginationMeta.last_page
                    }
                    className={`px-2 sm:px-3 py-1 rounded text-sm ${
                      paginationMeta.current_page === paginationMeta.last_page
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
