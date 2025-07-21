import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import HomesafeLogo from '../../../assets/images/HomesafeLogo2.svg';
import DashboardIcon from '../../../assets/icons/dashboard.svg';
import TrackIcon from '../../../assets/icons/track.svg';
import AllUsersIcon from '../../../assets/icons/staffs.svg';
import TransactionIcon from '../../../assets/icons/wallet.svg';
import ReviewIcon from '../../../assets/icons/review.svg';
import AdminIcon from '../../../assets/icons/security.svg';

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  path: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  path,
  isActive = false,
  onClick,
}) => {
  return (
    <Link to={path} className="text-decoration-none" onClick={onClick}>
      <div
        className={`flex items-center gap-3 py-3 px-4 cursor-pointer hover:bg-gray-100 rounded-md ${isActive ? 'bg-[#C8EDDF80]' : ''}`}
      >
        <div className="text-gray-600">{icon}</div>
        <span className="text-[#5A6672] text-[16px]">{text}</span>
      </div>
    </Link>
  );
};

interface SidebarProps {
  onItemClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const location = useLocation();

  const sidebarItems = [
    {
      name: 'Dashboard',
      icon: <img src={DashboardIcon} />,
      path: '/admin/dashboard',
    },
    {
      name: 'Track',
      icon: <img src={TrackIcon} />,
      path: '/admin/track',
    },
    {
      name: 'All Users',
      icon: <img src={AllUsersIcon} />,
      path: '/admin/all-users',
    },
    {
      name: 'Transaction',
      icon: <img src={TransactionIcon} />,
      path: '/admin/transactions',
    },
    {
      name: 'Reviews',
      icon: <img src={ReviewIcon} />,
      path: '/admin/reviews',
    },
    {
      name: 'Admin',
      icon: <img src={AdminIcon} />,
      path: '/admin/admin-settings',
    },
  ];

  return (
    <div
      id="admin-sidebar"
      className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col"
    >
      <img
        src={HomesafeLogo}
        alt="homesafe logo"
        className="w-[140px] sm:w-[178px] mx-auto mt-[2rem] sm:mt-[3rem] mb-[2rem] sm:mb-[3rem]"
      />

      <div className="flex-1 px-3 py-4">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.name}
            icon={item.icon}
            text={item.name}
            path={item.path}
            isActive={location.pathname === item.path}
            onClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
