import React from 'react';
import Document from '../../../assets/images/document-writing 1.svg';
import Subscribe from '../../../assets/images/subscribe.svg';
import Browse from '../../../assets/images/browse.svg';

interface StepCardProps {
  icon: string;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-start text-center">
      <img src={icon} alt={title} />
      <h3 className="font-semibold text-[24px] text-[#24292E] mb-2 mt-4">
        {title}
      </h3>
      <p className="text-[#48525B] text-[24px] text-left">{description}</p>
    </div>
  );
};

const HowItWorks: React.FC = () => {
  const steps = [
    {
      img: Document,
      title: 'Create an account',
      description: 'Sign up and create a professional profile as an employer.',
    },
    {
      img: Subscribe,
      title: 'Subscribe',
      description:
        'We have various rates with amazing services, select that which suites you.',
    },
    {
      img: Browse,
      title: 'Browse Artisans',
      description:
        'You can go through the list of employees we have and pick your preferred staff.',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-[40px] font-bold text-center text-[#39302A] mb-12">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              icon={step.img}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
