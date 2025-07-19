import React from 'react';
import Resources from '../../assets/images/Er1.png';

interface ResourceProps {
  title: string;
  startDate: string;
  description: string;
  chapterCount: number;
  recipeCount: number;
  thumbnail: string;
}

const ResourceCard: React.FC<ResourceProps> = ({
  title,
  startDate,
  description,
  chapterCount,
  recipeCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-6 p-3 sm:p-0">
      <img
        src={Resources}
        alt={title}
        className="w-full sm:w-[120px] lg:w-[140px] h-[120px] sm:h-[124px] lg:h-[144px] rounded mr-0 sm:mr-4 mb-3 sm:mb-0 object-cover"
      />
      <div className="flex-1">
        <h3 className="font-medium text-green-700 text-sm sm:text-base">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">Started: {startDate}</p>
        <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed">{description}</p>
        <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed">
          It has {chapterCount} chapters{' '}
          {recipeCount > 0 ? `and ${recipeCount} different recipes` : ''}.
        </p>
      </div>
    </div>
  );
};

interface CandidateResourcesProps {
  resources: ResourceProps[];
}

const CandidateResources: React.FC<CandidateResourcesProps> = ({
  resources,
}) => {
  return (
    <div className="p-2 sm:p-4">
      {resources.map((resource, index) => (
        <ResourceCard key={index} {...resource} />
      ))}
    </div>
  );
};

export default CandidateResources;
