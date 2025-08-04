import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import HomesafeLogo from '../../../assets/images/HomesafeLogo2.svg';
import DashboardIcon from '../../../assets/icons/dashboard.svg';
import WalletIcon from '../../../assets/icons/wallet.svg';
import ArtisansIcon from '../../../assets/icons/artisans.svg';
import StaffsIcon from '../../../assets/icons/staffs.svg';
import PayrollIcon from '../../../assets/icons/payroll.svg';
import ResourcesIcon from '../../../assets/icons/resources.svg';
import MedicalIcon from '../../../assets/icons/medical.svg';
import ReviewIcon from '../../../assets/icons/review.svg';
import AllContractsIcon from '../../../assets/icons/contracts.svg';

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
      path: '/employer/dashboard',
    },
    {
      name: 'Wallet',
      icon: <img src={WalletIcon} />,
      path: '/employer/wallet',
    },
    {
      name: 'Artisans',
      icon: <img src={ArtisansIcon} />,
      path: '/employer/artisans',
    },
    {
      name: 'My Staff',
      icon: <img src={StaffsIcon} />,
      path: '/employer/staff',
    },
    {
      name: 'Suggestions',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16,17 21,12 16,7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      ),
      path: '/employer/suggestions',
    },
    {
      name: 'Payroll',
      icon: <img src={PayrollIcon} />,
      path: '/employer/payroll',
    },
    {
      name: 'Resources',
      icon: <img src={ResourcesIcon} />,
      path: '/employer/resources',
    },
    {
      name: 'Medical',
      icon: <img src={MedicalIcon} />,
      path: '/employer/medical',
    },
    {
      name: 'Review',
      icon: <img src={ReviewIcon} />,
      path: '/employer/review',
    },
    {
      name: 'All Contracts',
      icon: <img src={AllContractsIcon} />,
      path: '/employer/contracts',
    },
  ];

  return (
    <div
      id="employer-sidebar"
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
