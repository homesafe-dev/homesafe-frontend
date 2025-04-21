
import Frame1 from '../../../assets/images/Frame1.png';
import Frame2 from '../../../assets/images/Frame2.png';
import Frame3 from '../../../assets/images/Frame3.png';
import Frame4 from '../../../assets/images/Frame4.png';
import Frame5 from '../../../assets/images/Frame5.png';
import Frame6 from '../../../assets/images/Frame6.png';
import Frame7 from '../../../assets/images/Frame7.png'

export default function JobCategories() {
  const topRowJobs = [
    {
      id: 1,
      title: 'Housekeeper/Maid',
      description: 'Responsible for cleaning, tidying, and general upkeep of the home (this may include laundry and ironing).',
      image: Frame7
    },
    {
      id: 2,
      title: 'Cook/Chef',
      description: 'Prepares meals, plans menus, and may handle grocery shopping.',
      image: Frame6
    },
    {
      id: 3,
      title: 'Childcare Provider',
      description: 'Takes care of children\'s needs, including feeding, supervising, and sometimes educational activities or transportation.',
      image: Frame5
    },
    {
      id: 4,
      title: 'Gardener/Groundskeeper',
      description: 'Manages outdoor spaces such as gardens, lawns, and patios, including tasks like planting and seasonal maintenance.',
      image: Frame1
    }
  ];

  const bottomRowJobs = [
    {
      id: 5,
      title: 'Driver/Chauffeur',
      description: 'Provides transportation for family members and may also be responsible for maintaining the household vehicle(s).',
      image: Frame2
    },
    {
      id: 6,
      title: 'Security/Gate Guard',
      description: 'Ensures the security of the compound and its surroundings, including gate access management.',
      image: Frame3
    },
    {
      id: 7,
      title: 'Butler/Household Manager',
      description: 'Oversees the daily operations of the household, coordinates schedules, and supervises other staff members.',
      image: Frame4
    }
  ];

  return (
    <div className="w-full bg-white py-12">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-[40px] font-bold text-center mb-10">
          <span className="text-teal-600">Job</span> Categories
        </h2>
        
      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {topRowJobs.map((job) => (
            <div key={job.id} className="border border-[#37A379] rounded-md overflow-hidden shadow-sm">
              <div className="h-48 overflow-hidden p-4">
                <img 
                  src={job.image} 
                  alt={job.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#24292E] text-[20px] mb-2">{job.title}</h3>
                <p className="text-[16px] text-gray-500">{job.description}</p>
              </div>
            </div>
          ))}
        </div>
        
    
        <div className="flex justify-center mt-[2rem]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
            {bottomRowJobs.map((job) => (
              <div key={job.id} className="border border-[#37A379] rounded-md overflow-hidden shadow-sm">
                <div className="h-48 overflow-hidden p-4">
                  <img 
                    src={job.image} 
                    alt={job.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-2">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}