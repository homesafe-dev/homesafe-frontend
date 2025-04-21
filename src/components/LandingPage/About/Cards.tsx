import Target from '../../../assets/icons/target.svg';
import Vision from '../../../assets/icons/vision.svg';

export default function Cards() {
  return (
    <div className="w-full bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 justify-between mt-[2rem]">
          <div className="flex-1 flex flex-col items-start shadow-sm p-8">
            <img src={Vision} alt="vision image" />
            <h2 className="text-[40px] font-semibold text-gray-700 mb-4">
              Vision
            </h2>
            <p className="text-[24px] text-[#48525B] leading-relaxed">
              At Homesafe, our vision is to become the leading platform and your
              go to agency for hiring skilled, reliable, safe and highly
              discreet Artisans to our clients, in a seamless, fast and secured
              way, in return providing legitimate employment to skilled workers.
            </p>
          </div>

          <div className="flex-1 flex flex-col items-start shadow-md p-8">
            <img src={Target} alt="misson image" />
            <h2 className="text-[40px] font-semibold text-gray-700 mb-4">
              Mission
            </h2>
            <p className="text-[24px] text-[#48525B] leading-relaxed">
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
