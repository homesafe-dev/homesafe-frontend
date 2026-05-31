import React from 'react';
import { useLocation } from 'react-router-dom';
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
import AppSidebarItem from '../../common/AppSidebarItem';

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
      className="w-64 h-screen bg-surface border-r border-border-default flex flex-col"
    >
      <img
        src={HomesafeLogo}
        alt="homesafe logo"
        className="w-[140px] sm:w-[178px] mx-auto mt-[2rem] sm:mt-[3rem] mb-[2rem] sm:mb-[3rem] dark:brightness-110"
      />

      <div className="flex-1 px-3 py-4">
        {sidebarItems.map((item) => (
          <AppSidebarItem
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
