import React, { useState, useEffect } from 'react';
import {
  MoreVertical,
  Share2,
  Download,
  Search,
  BookOpen,
  Play,
  Video,
  X,
} from 'lucide-react';
import EmployeeResourceShareModal from '../../components/Employer/EmployeeResourceShareModal';
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
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
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

  const handleShare = (resource: Resource) => {
    setSelectedResource(resource);
    setIsShareModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDownload = () => {
    setActiveMenuId(null);
  };

  const handleWatchVideo = (resource: Resource) => {
    setSelectedResource(resource);
    setIsVideoModalOpen(true);
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedResource(null);
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

  // Filter resources based on search query
  const filteredResources = resources.filter((resource) => {
    const query = searchQuery.toLowerCase();
    return (
      resource.occupation.name.toLowerCase().includes(query) ||
      resource.description.toLowerCase().includes(query) ||
      resource.video_link.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-0">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Resources
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Educational resources and training materials
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-surface rounded-lg shadow-sm border border-border-default">
        {/* Search Section */}
        <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-border-default">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for video, link, or description..."
                className="w-full pl-10 pr-4 py-2.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredResources.length} of {resources.length} resources
          </div>
        </div>

        <EmployeeResourceShareModal
          isOpen={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false);
            setSelectedResource(null);
          }}
          resourceId={selectedResource?.id || 0}
          resourceTitle={
            selectedResource?.occupation?.name
              ? `${selectedResource.occupation.name} Training`
              : 'Resource'
          }
        />

        {/* Resources Grid */}
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg inline-block">
                {error}
              </div>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No resources found
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? 'Try adjusting your search criteria'
                  : 'No resources available at the moment'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-border-default hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={`https://img.youtube.com/vi/${getYoutubeVideoId(resource.video_link)}/hqdefault.jpg`}
                      alt={`${resource.occupation.name} resource`}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x200';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        Video
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start relative mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base truncate pr-2">
                        {resource.occupation.name.charAt(0).toUpperCase() +
                          resource.occupation.name.slice(1)}{' '}
                        Training
                      </h3>
                      <div className="relative">
                        <button
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(resource.id);
                          }}
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {activeMenuId === resource.id.toString() && (
                          <div
                            className="absolute top-8 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border-default overflow-hidden z-10 w-40"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              className="px-4 py-2 hover:bg-elevated/50 flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300"
                              onClick={() => handleShare(resource)}
                            >
                              <Share2 className="w-4 h-4" />
                              Share
                            </div>
                            <div
                              className="px-4 py-2 hover:bg-elevated/50 flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300"
                              onClick={handleDownload}
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                      {resource.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-border-default">
                      <button
                        onClick={() => handleWatchVideo(resource)}
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        Watch Video
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {paginationMeta && paginationMeta.last_page > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border-default px-4 sm:px-6">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Page{' '}
                <span className="font-medium">
                  {paginationMeta.current_page}
                </span>{' '}
                of{' '}
                <span className="font-medium">{paginationMeta.last_page}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handlePageChange(paginationMeta.current_page - 1)
                  }
                  disabled={paginationMeta.current_page === 1}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    paginationMeta.current_page === 1
                      ? 'border-gray-200 dark:border-gray-700 text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-elevated/50'
                  }`}
                >
                  Previous
                </button>

                {Array.from(
                  { length: paginationMeta.last_page },
                  (_, i) => i + 1
                ).map((page) => {
                  if (
                    page === 1 ||
                    page === paginationMeta.last_page ||
                    (page >= paginationMeta.current_page - 1 &&
                      page <= paginationMeta.current_page + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          page === paginationMeta.current_page
                            ? 'bg-green-600 text-white'
                            : 'border border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-elevated/50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === paginationMeta.current_page - 2 ||
                    page === paginationMeta.current_page + 2
                  ) {
                    return (
                      <span
                        key={page}
                        className="px-2 text-gray-500 dark:text-gray-400"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() =>
                    handlePageChange(paginationMeta.current_page + 1)
                  }
                  disabled={
                    paginationMeta.current_page === paginationMeta.last_page
                  }
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    paginationMeta.current_page === paginationMeta.last_page
                      ? 'border-gray-200 dark:border-gray-700 text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-elevated/50'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && selectedResource && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCloseVideoModal}
          ></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl relative z-10 m-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center rounded-t-lg">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {selectedResource.occupation.name.charAt(0).toUpperCase() +
                    selectedResource.occupation.name.slice(1)}{' '}
                  Training
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {selectedResource.description}
                </p>
              </div>
              <button
                onClick={handleCloseVideoModal}
                className="rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              <div
                className="relative w-full"
                style={{ paddingBottom: '56.25%' }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${getYoutubeVideoId(selectedResource.video_link)}?autoplay=1`}
                  title={selectedResource.occupation.name + ' Training'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  href={selectedResource.video_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-elevated/50 transition-colors text-sm font-medium"
                >
                  Open on YouTube
                </a>
                <button
                  onClick={handleCloseVideoModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
