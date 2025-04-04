import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import HomesafeLogo from '../../../assets/images/HomesafeLogo2.svg';
import DashboardIcon from '../../../assets/icons/dashboard.svg';
import CandidatesIcon from '../../../assets/icons/candidates.svg';
import TrackIcon from '../../../assets/icons/track.svg';
import ComplianceIcon from '../../../assets/icons/compliace.svg';
import ReviewIcon from '../../../assets/icons/review.svg';

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  path: string;
  isActive?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  path,
  isActive = false,
}) => {
  return (
    <Link to={path} className="text-decoration-none">
      <div
        className={`flex items-center gap-3 py-3 px-4 cursor-pointer hover:bg-gray-100 rounded-md ${isActive ? 'bg-[#C8EDDF80]' : ''}`}
      >
        <div className="text-gray-600">{icon}</div>
        <span className="text-[#5A6672] text-[16px]">{text}</span>
      </div>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();

  const sidebarItems = [
    {
      name: 'Dashboard',
      icon: <img src={DashboardIcon} />,
      path: '/agent/dashboard',
    },
    {
      name: 'Candidates',
      icon: <img src={CandidatesIcon} />,
      path: '/agent/candidates',
    },
    {
      name: 'Track',
      icon: <img src={TrackIcon} />,
      path: '/agent/track',
    },
    {
      name: 'Compliance',
      icon: <img src={ComplianceIcon} />,
      path: '/agent/compliance',
    },
    {
      name: 'Review',
      icon: <img src={ReviewIcon} />,
      path: '/agent/review',
    },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Container */}
      <img
        src={HomesafeLogo}
        alt="homesafe logo"
        className="w-[178px] mx-auto mt-[3rem]  mb-[3rem]"
      />

      {/* Navigation Items */}
      <div className="flex-1 px-3 py-4">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.name}
            icon={item.icon}
            text={item.name}
            path={item.path}
            isActive={location.pathname === item.path}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
