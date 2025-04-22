import React from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import TestimonialImg from '../../../assets/images/Testimonial.png';

interface TestimonialProps {
  rating: number;
  quote: string;
  author: string;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
  }

  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-400" />);
  }

  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaStar key={`empty-star-${i}`} className="text-gray-300" />);
  }

  return <div className="flex space-x-1">{stars}</div>;
};

const TestimonialCard: React.FC<TestimonialProps> = ({
  rating,
  quote,
  author,
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg h-full flex flex-col">
      <div>
        <StarRating rating={rating} />
        <p className="mt-4 mb-8 text-[#24292E] text-[16px]">{quote}</p>
      </div>
      <div className="flex items-center mt-auto">
        <img
          src={TestimonialImg}
          alt={author}
          className="w-10 h-10 rounded-full mr-3"
        />
        <span className="text-[#24292E] text-[15px]">{author}</span>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      rating: 5,
      quote:
        'Working with Seyi from Homesafe has been one of the best decisions I took this year, sheis so perfect for me, much so that I keep calm while at work, knowing my daughter is well taken care of.',
      author: 'Biola Animashaun',
    },
    {
      rating: 4.5,
      quote:
        'Homesafe is an app I wish had existed way before now, it would have saved me a lot of trauma, as regards household thefts and other bad experiences.',
      author: 'Goodness Okolugbo',
    },
    {
      rating: 4.5,
      quote:
        'At Least I would not have to go through the stress of screening, shortlisting and hiring before I get the perfect person for the job, neither am I worried of my privacy and confidentiality being violated, thank you Homesafe!',
      author: 'Hammed Sanmi',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-[40px] font-bold text-center mb-12 text-[#39302A]">
          Testimonials
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              rating={testimonial.rating}
              quote={testimonial.quote}
              author={testimonial.author}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
