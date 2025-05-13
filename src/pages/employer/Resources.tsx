import React, { useState } from 'react';
import { FiMoreVertical, FiShare2, FiDownload, FiSearch } from 'react-icons/fi';
import ResourceImg1 from '../../assets/images/Resource1.png';
import ResourceImg2 from '../../assets/images/Resource2.png';
import ResourceImg3 from '../../assets/images/Resource3.png';
import ShareModal from '../../components/Employer/ResourceShareModal';

const ResourcesPage: React.FC = () => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const resources = [
    {
      id: '1',
      title: 'How to make Soup',
      description:
        'Meet Cali foster, a passionate chef from Lagos State, Nigeria. With a love for cooking that knows no bounds, Cali brings the flavors of Lagos to every dish.',
      image: ResourceImg1,
      type: 'Video',
      url: 'www.makesoup.com',
    },
    {
      id: '2',
      title: 'How to make Soup',
      description:
        'Meet Cali foster, a passionate chef from Lagos State, Nigeria. With a love for cooking that knows no bounds, Cali brings the flavors of Lagos to every dish.',
      image: ResourceImg1,
      type: 'PDF',
      url: 'www.makesoup.com',
    },
    {
      id: '3',
      title: 'How to make Soup',
      description:
        'Meet Cali foster, a passionate chef from Lagos State, Nigeria. With a love for cooking that knows no bounds, Cali brings the flavors of Lagos to every dish.',
      image: ResourceImg2,
      type: 'Video',
      url: 'www.makesoup.com',
    },
    {
      id: '4',
      title: 'How to make Soup',
      description:
        'Meet Cali foster, a passionate chef from Lagos State, Nigeria. With a love for cooking that knows no bounds, Cali brings the flavors of Lagos to every dish.',
      image: ResourceImg1,
      type: 'Video',
      url: 'www.makesoup.com',
    },
    {
      id: '5',
      title: 'How to make Soup',
      description:
        'Meet Cali foster, a passionate chef from Lagos State, Nigeria. With a love for cooking that knows no bounds, Cali brings the flavors of Lagos to every dish.',
      image: ResourceImg3,
      type: 'PDF',
      url: 'www.makesoup.com',
    },
    {
      id: '6',
      title: 'How to make Soup',
      description:
        'Meet Cali foster, a passionate chef from Lagos State, Nigeria. With a love for cooking that knows no bounds, Cali brings the flavors of Lagos to every dish.',
      image: ResourceImg1,
      type: 'Video',
      url: 'www.makesoup.com',
    },
  ];

  const toggleMenu = (id: string) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDownload = (id: string) => {
    setActiveMenuId(null);
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
    <div className=" min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Resources</h1>
          <div className="flex items-center">
            <div className="relative rounded-[16px] border border-gray-100 px-4 py-2 flex items-center w-[480px]">
              <FiSearch className="text-gray-400 mr-2" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="rounded-lg overflow-hidden bg-white p-2 shadow-sm border border-gray-50"
            >
              <div className="relative">
                <img
                  src={resource.image}
                  alt={resource.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x200';
                  }}
                />
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start relative">
                  <h3 className="font-medium text-gray-900">
                    {resource.title}
                  </h3>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(resource.id);
                    }}
                  >
                    <FiMoreVertical />
                  </button>
                  {activeMenuId === resource.id && (
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
                        onClick={() => handleDownload(resource.id)}
                      >
                        <FiDownload className="mr-2" />
                        Download
                      </div>
                    </div>
                  )}
                </div>

                <p className="mt-2 text-sm text-gray-600">
                  {resource.description}
                </p>

                <div className="mt-4 flex justify-between items-center">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm hover:underline"
                  >
                    {resource.url}
                  </a>
                  <div
                    className={`px-2 py-1 text-xs rounded-md ${
                      resource.type === 'Video'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {resource.type}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
