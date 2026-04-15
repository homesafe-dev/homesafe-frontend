import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, Star } from 'lucide-react';
import HomesafeLogo from '../../../assets/images/HomesafeLogo2.svg';

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
        className={`flex items-center gap-3 py-3 px-4 cursor-pointer rounded-lg transition-colors ${
          isActive
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <div className={isActive ? 'text-green-700' : 'text-gray-500'}>
          {icon}
        </div>
        <span
          className={`text-sm font-medium ${
            isActive ? 'text-green-700' : 'text-gray-700'
          }`}
        >
          {text}
        </span>
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
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/agent/dashboard',
    },
    {
      name: 'Candidates',
      icon: <Users className="w-5 h-5" />,
      path: '/agent/all-candidates',
    },
    {
      name: 'Track',
      icon: <UserCheck className="w-5 h-5" />,
      path: '/agent/track',
    },
    {
      name: 'Review',
      icon: <Star className="w-5 h-5" />,
      path: '/agent/review',
    },
  ];

  // Check if path matches (handles exact and nested routes)
  const isActive = (path: string) => {
    if (path === '/agent/dashboard') {
      return location.pathname === '/agent' || location.pathname === path;
    }
    return (
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
  };

  return (
    <div
      id="agent-sidebar"
      className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col"
    >
      <img
        src={HomesafeLogo}
        alt="homesafe logo"
        className="w-[140px] sm:w-[178px] mx-auto mt-[2rem] sm:mt-[3rem] mb-[2rem] sm:mb-[3rem] dark:brightness-110"
      />

      <div className="flex-1 px-3 py-4">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.name}
            icon={item.icon}
            text={item.name}
            path={item.path}
            isActive={isActive(item.path)}
            onClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
