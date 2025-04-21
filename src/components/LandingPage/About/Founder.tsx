
import AgentsImg from '../../../assets/images/Agents.png';

export default function Founder() {
  return (
    <div className="w-full bg-[#F8F8F8] py-8 mt-[2rem] pb-[4rem]">
      <div className="max-w-7xl mx-auto px-4 flex flex-row justify-between gap-[2rem] mt-[4rem]">
       
        <div className="w-[45%]">
          <img src={AgentsImg} alt="agent image" />
        </div>
        
        
        <div className="w-[45%]">
          <h2 className="text-[40px] font-semibold text-gray-800 mb-4">About Founder</h2>
          <p className="text-[#48525B] text-[20px] leading-relaxed">
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
  );
}