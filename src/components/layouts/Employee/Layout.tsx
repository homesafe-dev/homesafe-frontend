import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface EmployeeLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: EmployeeLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 