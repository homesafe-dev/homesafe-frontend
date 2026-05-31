import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  Briefcase,
  Users,
  Send,
  CalendarSync,
  BookOpen,
  Heart,
  Star,
  FileText,
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
      path: '/employer/dashboard',
    },
    {
      name: 'Wallet',
      icon: <Wallet className="w-5 h-5" />,
      path: '/employer/wallet',
    },
    {
      name: 'Transactions',
      icon: <CreditCard className="w-5 h-5" />,
      path: '/employer/transactions',
    },
    {
      name: 'Artisans',
      icon: <Briefcase className="w-5 h-5" />,
      path: '/employer/artisans',
    },
    {
      name: 'My Staff',
      icon: <Users className="w-5 h-5" />,
      path: '/employer/staff',
    },
    {
      name: 'Suggestions',
      icon: <Send className="w-5 h-5" />,
      path: '/employer/suggestions',
    },
    {
      name: 'Payroll',
      icon: <CalendarSync className="w-5 h-5" />,
      path: '/employer/payroll',
    },
    {
      name: 'Resources',
      icon: <BookOpen className="w-5 h-5" />,
      path: '/employer/resources',
    },
    {
      name: 'Medical',
      icon: <Heart className="w-5 h-5" />,
      path: '/employer/medical',
    },
    {
      name: 'Review',
      icon: <Star className="w-5 h-5" />,
      path: '/employer/review',
    },
    {
      name: 'All Contracts',
      icon: <FileText className="w-5 h-5" />,
      path: '/employer/contracts',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/employer/dashboard') {
      return location.pathname === '/employer' || location.pathname === path;
    }
    return (
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
  };

  return (
    <div
      id="employer-sidebar"
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
