import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CreditCard,
  Star,
  Shield,
  BadgeDollarSign,
} from 'lucide-react';
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
            ? 'bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/40'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
      >
        <div
          className={
            isActive
              ? 'text-green-700 dark:text-green-300'
              : 'text-gray-500 dark:text-gray-400'
          }
        >
          {icon}
        </div>
        <span
          className={`text-sm font-medium ${
            isActive
              ? 'text-green-700 dark:text-green-300'
              : 'text-gray-700 dark:text-gray-200'
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
      path: '/admin/dashboard',
    },
    {
      name: 'Track',
      icon: <UserCheck className="w-5 h-5" />,
      path: '/admin/track',
    },
    {
      name: 'All Users',
      icon: <Users className="w-5 h-5" />,
      path: '/admin/all-users',
    },
    {
      name: 'Transactions',
      icon: <CreditCard className="w-5 h-5" />,
      path: '/admin/transactions',
    },
    {
      name: 'Reviews',
      icon: <Star className="w-5 h-5" />,
      path: '/admin/reviews',
    },
    {
      name: 'Admin Settings',
      icon: <Shield className="w-5 h-5" />,
      path: '/admin/admin-settings',
    },
    {
      name: 'Subscription Plans',
      icon: <BadgeDollarSign className="w-5 h-5" />,
      path: '/admin/subscription-plans',
    },
  ];

  // Check if path matches (handles exact and nested routes)
  const isActive = (path: string) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin' || location.pathname === path;
    }
    return (
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
  };

  return (
    <div
      id="admin-sidebar"
      className="w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col"
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
