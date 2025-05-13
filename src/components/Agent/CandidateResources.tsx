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
    <div className="flex items-center mb-6">
      <img
        src={Resources}
        alt={title}
        className="w-[140px] h-[144px] rounded mr-4"
      />
      <div>
        <h3 className="font-medium text-green-700">{title}</h3>
        <p className="text-xs text-gray-500">Started: {startDate}</p>
        <p className="text-xs text-gray-700 mt-1">{description}</p>
        <p className="text-xs text-gray-700">
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
    <div className="p-4">
      {resources.map((resource, index) => (
        <ResourceCard key={index} {...resource} />
      ))}
    </div>
  );
};

export default CandidateResources;
