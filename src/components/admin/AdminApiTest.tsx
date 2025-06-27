import React, { useState } from 'react';
import adminApi from '../../api/adminApi';

const AdminApiTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testGetAdmins = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing GET /api/users?role=admin&limit=10...');
      const response = await adminApi.getAdminList(1, 10);
      setResult(response);
      console.log('✅ API call successful:', response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
      setError(errorMessage);
      console.error('❌ API call failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const testDirectFetch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing direct fetch...');
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await fetch('https://homesafeng.xyz/api/users?role=admin&limit=10', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      console.log('✅ Direct fetch successful:', data);
    } catch (err: any) {
      setError(err.message);
      console.error('❌ Direct fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Admin API Test</h2>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={testGetAdmins}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test adminApi.getAdminList()'}
          </button>
          
          <button
            onClick={testDirectFetch}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Direct Fetch'}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <strong>Success!</strong>
            <details className="mt-2">
              <summary className="cursor-pointer font-medium">View Response</summary>
              <pre className="mt-2 text-sm bg-white p-2 rounded border overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
            
            {result.data?.data && (
              <div className="mt-4">
                <p><strong>Total Admins:</strong> {result.data.total || result.data.data.length}</p>
                <p><strong>Current Page:</strong> {result.data.current_page || 1}</p>
                <p><strong>Per Page:</strong> {result.data.per_page || result.data.data.length}</p>
                
                {result.data.data.length > 0 && (
                  <div className="mt-2">
                    <strong>First Admin:</strong>
                    <ul className="ml-4 text-sm">
                      <li>Name: {result.data.data[0].first_name} {result.data.data[0].last_name}</li>
                      <li>Email: {result.data.data[0].email}</li>
                      <li>Phone: {result.data.data[0].phone}</li>
                      <li>Verified: {result.data.data[0].is_verified ? 'Yes' : 'No'}</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-medium mb-2">Instructions:</h3>
        <ol className="text-sm space-y-1">
          <li>1. Make sure you're logged in as an admin</li>
          <li>2. Click "Test adminApi.getAdminList()" to test the API method</li>
          <li>3. Click "Test Direct Fetch" to test the raw API call</li>
          <li>4. Check the browser console for detailed logs</li>
        </ol>
      </div>
    </div>
  );
};

export default AdminApiTest;
