import AgentsImg from '../../../assets/images/Agents.png';

export default function Founder() {
  return (
    <div className="w-full bg-[#F8F8F8] py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 lg:gap-16">
          <div className="w-full md:w-1/2 max-w-lg">
            <img
              src={AgentsImg}
              alt="agent image"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>

          <div className="w-full md:w-1/2 max-w-lg">
            <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-semibold text-gray-800 mb-4 text-center md:text-left">
              About Founder
            </h2>
            <p className="text-[#48525B] text-base sm:text-lg lg:text-xl leading-relaxed">
              Providing outstanding services for your homes and offices.
              Providing outstanding services for your homes and offices.
              Providing outstanding services for your homes and offices.
              Providing outstanding services for your homes and offices.
              Providing outstanding services for your homes and offices.
              Providing outstanding services for your homes and offices.
              Providing outstanding services for your homes and offices.
              Providing outstanding services for your homes and offices.
              Providing outstanding services for your homes and offices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
