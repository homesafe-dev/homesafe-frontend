import Target from '../../../assets/icons/target.svg';
import Vision from '../../../assets/icons/vision.svg';

export default function Cards() {
  return (
    <div className="w-full bg-white py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Vision Card */}
          <div className="flex flex-col bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8">
            <div className="w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center mb-4">
              <img src={Vision} alt="Vision icon" className="w-full h-full" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-semibold text-gray-700 mb-3 sm:mb-4">
              Vision
            </h2>
            <p className="text-[#48525B] text-base sm:text-lg lg:text-2xl leading-relaxed">
              At Homesafe, our vision is to become the leading platform and your
              go to agency for hiring skilled, reliable, safe and highly
              discreet Artisans to our clients, in a seamless, fast and secured
              way, in return providing legitimate employment to skilled workers.
            </p>
          </div>

          {/* Mission Card */}
          <div className="flex flex-col bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8">
            <div className="w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center mb-4">
              <img src={Target} alt="Mission icon" className="w-full h-full" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-semibold text-gray-700 mb-3 sm:mb-4">
              Mission
            </h2>
            <p className="text-[#48525B] text-base sm:text-lg lg:text-2xl leading-relaxed">
              Our Mission at Homesafe is to make hiring safe, simple, and
              efficient for every Living Space, and to create a job search space
              for Artisans to apply through.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
