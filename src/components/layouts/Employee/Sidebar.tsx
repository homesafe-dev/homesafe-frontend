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

// Define the sidebar item type
interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  path: string;
  isActive?: boolean;
  onClick: () => void;
}

// Sidebar Item Component
const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  path,
  isActive = false,
  onClick,
}) => {
  return (
    <Link to={path} className="text-decoration-none">
      <div
        className={`flex items-center gap-3 py-3 px-4 cursor-pointer hover:bg-gray-100 rounded-md ${isActive ? 'bg-[#C8EDDF80]' : ''}`}
        onClick={onClick}
      >
        <div className="text-gray-600">{icon}</div>
        <span className="text-[#5A6672] text-[16px]">{text}</span>
      </div>
    </Link>
  );
};

// Main Sidebar Component
const Sidebar: React.FC = () => {
  const location = useLocation();

  const handleItemClick = () => {
    // Handle any click events if needed
  };

  // Sidebar items configuration
  const sidebarItems = [
    {
      name: 'Dashboard',
      icon: <img src={DashboardIcon} />,
      path: '/employee/dashboard',
    },
    {
      name: 'Salary',
      icon: <img src={WalletIcon} />,
      path: '/employee/salary',
    },
    // {
    //   name: 'Artisans',
    //   icon: <img src={ArtisansIcon} />,
    //   path: '/employer/artisans',
    // },
    // {
    //   name: 'My Staff',
    //   icon: <img src={StaffsIcon} />,
    //   path: '/employer/staff',
    // },
    // {
    //   name: 'Payroll',
    //   icon: <img src={PayrollIcon} />,
    //   path: '/employer/payroll',
    // },
    {
      name: 'Resources',
      icon: <img src={ResourcesIcon} />,
      path: '/employee/resources',
    },
    {
      name: 'Medical',
      icon: <img src={MedicalIcon} />,
      path: '/employee/medical',
    },
    {
      name: 'Review',
      icon: <img src={ReviewIcon} />,
      path: '/employee/review',
    },
    {
      name: 'All Contracts',
      icon: <img src={AllContractsIcon} />,
      path: '/employee/contracts',
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
            onClick={() => handleItemClick()}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
