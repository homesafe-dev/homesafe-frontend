// EducationalResources.tsx
import React from 'react';
import Resources from '../../assets/images/Er1.png'
import MedicalImg from '../../assets/images/medical.png'
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
  thumbnail
}) => {
  return (
    <div className="flex items-center mb-6">
      <img src={Resources} alt={title} className="w-[140px] h-[144px] rounded mr-4" />
      <div>
        <h3 className="font-medium text-green-700">{title}</h3>
        <p className="text-xs text-gray-500">Started: {startDate}</p>
        <p className="text-xs text-gray-700 mt-1">{description}</p>
        <p className="text-xs text-gray-700">It has {chapterCount} chapters and {recipeCount} different recipes on how well to make pasta with oor with cheese.</p>
      </div>
    </div>
  );
};

interface EducationalResourcesProps {
  resources: ResourceProps[];
}

const EducationalResources: React.FC<EducationalResourcesProps> = ({ resources }) => {
  return (
    <div className="p-4">
      {resources.map((resource, index) => (
        <ResourceCard key={index} {...resource} />
      ))}
    </div>
  );
};

export default EducationalResources;