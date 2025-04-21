import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import Homes from '../../../assets/images/Homes.png';
import Office from '../../../assets/images/Office.png';
import LivingSpace from '../../../assets/images/LivingSpace.png';
import Hotel from '../../../assets/images/Hotel.png';

interface WorkCategoryProps {
  title: string;
  imageSrc: string;
  description: string;
}

const WorkCategory: React.FC<WorkCategoryProps> = ({ title, imageSrc, description }) => {
  return (
    <div className="flex flex-col">
      <div className="rounded-lg overflow-hidden mb-3">
        <img 
          src={imageSrc}
          alt={title}
          className="w-full h-[239px] object-cover"
        />
      </div>
      <h3 className="text-[24px] font-semibold text-[#FFFFFF] mb-2">{title}</h3>
      <p className="text-[20px] text-[#F6F6F6]">{description}</p>
    </div>
  );
};

const WhereWeCanWork: React.FC = () => {
  const categories = [
    {
      title: "Office",
      imageSrc: Office,
      description: "Providing outstanding services for your homes and offices."
    },
    {
      title: "Homes",
      imageSrc: Homes,
      description: "Providing outstanding services for your homes and offices."
    },
    {
      title: "Hotel",
      imageSrc: Hotel,
      description: "Providing outstanding services for your homes and offices."
    },
    {
      title: "Living Spaces",
      imageSrc: LivingSpace,
      description: "Providing outstanding services for your homes and offices."
    }
  ];

  return (
    <section className="bg-[#123628] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Where we can work</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <WorkCategory
              key={index}
              title={category.title}
              imageSrc={category.imageSrc}
              description={category.description}
            />
          ))}
        </div>

      
      </div>
    </section>
  );
};

export default WhereWeCanWork;