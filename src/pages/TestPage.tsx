import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const TestPage: React.FC = () => {
  const { user, isAuthenticated, hasRole, logout } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test Page</h1>

      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Authentication Status</h2>
        <p>
          <strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
        </p>
      </div>

      {user && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">User Information</h2>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.type}
          </p>
        </div>
      )}

      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Role Checks</h2>
        <p>
          <strong>Is Employer:</strong> {hasRole('employer') ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Is Employee:</strong> {hasRole('employee') ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Is Agent:</strong> {hasRole('agent') ? 'Yes' : 'No'}
        </p>
      </div>

      <button
        onClick={() => logout()}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default TestPage;
