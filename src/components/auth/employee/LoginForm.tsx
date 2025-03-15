import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

export default function EmployeeLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, 'employee');
    navigate('/employee/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-green-400 to-green-600">
    
    </div>
  );
} 