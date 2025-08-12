import React from 'react';
import axiosInstance from '../../api/axiosConfig';

function getQueryParam(paramName: string): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get(paramName);
}

const GoogleAuthCallback: React.FC = () => {
  const [message, setMessage] = React.useState<string>('Completing sign-in...');

  React.useEffect(() => {
    const completeLogin = async () => {
      try {
        const token =
          getQueryParam('token') || getQueryParam('access_token') || '';

        if (!token) {
          setMessage('Missing token in callback. Redirecting to login...');
          setTimeout(() => {
            window.location.replace('/login');
          }, 1200);
          return;
        }

        // Persist token for axios interceptor
        localStorage.setItem('auth_token', token);

        // Fetch profile to construct user object and determine role
        const profileResponse = await axiosInstance.get('/profile');

        const profile =
          profileResponse?.data?.data || profileResponse?.data || {};

        const role: string = profile.role || 'employer';
        const userObj = {
          id: String(profile.id ?? '1'),
          email: String(profile.email ?? ''),
          name: `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim(),
          type: role as 'employer' | 'employee' | 'agent' | 'admin',
        };

        localStorage.setItem('auth_user', JSON.stringify(userObj));

        // Optional redirect: if a protected route stored a redirect, honor it if it matches role
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
          sessionStorage.removeItem('redirectAfterLogin');
          const rolePrefix = `/${userObj.type}`;
          if (redirectUrl.startsWith(rolePrefix)) {
            window.location.replace(redirectUrl);
            return;
          }
        }

        // Default role-based dashboard redirect
        if (userObj.type === 'employee') {
          window.location.replace('/employee/dashboard');
        } else if (userObj.type === 'agent') {
          window.location.replace('/agent/dashboard');
        } else if (userObj.type === 'admin') {
          window.location.replace('/admin/dashboard');
        } else {
          window.location.replace('/employer/dashboard');
        }
      } catch (err) {
        // Cleanup on failure
        console.log(err);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setMessage('Sign-in failed. Redirecting to login...');
        setTimeout(() => {
          window.location.replace('/login');
        }, 1200);
      }
    };

    void completeLogin();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-700 text-sm">{message}</p>
    </div>
  );
};

export default GoogleAuthCallback;
