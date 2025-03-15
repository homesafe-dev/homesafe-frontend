import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="w-64 bg-white shadow-lg h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800">Employee Portal</h2>
       </div>
    </div>
  );
} 