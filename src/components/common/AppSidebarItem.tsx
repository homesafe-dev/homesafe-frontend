import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AppSidebarItemProps {
  icon: ReactNode;
  text: string;
  path: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function AppSidebarItem({
  icon,
  text,
  path,
  isActive = false,
  onClick,
}: AppSidebarItemProps) {
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
}
