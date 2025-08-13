import React from 'react';
import axiosInstance from '../../api/axiosConfig';

const GoogleAuthCallback: React.FC = () => {
  const [message, setMessage] = React.useState<string>('Completing sign-in...');

  React.useEffect(() => {
    const completeLogin = async () => {
      try {
        console.log('Google OAuth Callback - Processing callback...');

        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const error = params.get('error');
        const userJson = params.get('user');

        console.log('Token:', token);
        console.log('Error:', error);
        console.log('User JSON:', userJson);

        if (error) {
          console.error('OAuth error:', error);
          setMessage(`OAuth error: ${error}. Redirecting to login...`);
          setTimeout(() => {
            window.location.replace('/login');
          }, 2000);
          return;
        }

        if (!token) {
          console.error('Missing token');
          setMessage('Missing authentication token. Redirecting to login...');
          setTimeout(() => {
            window.location.replace('/login');
          }, 2000);
          return;
        }

        // Store token first (this enables the axios interceptor)
        localStorage.setItem('auth_token', token);
        console.log('Token stored successfully');

        try {
          // Fetch user profile from API (same as normal login)
          console.log('Fetching user profile...');
          const profileResponse = await axiosInstance.get('/profile');
          const profile =
            profileResponse?.data?.data || profileResponse?.data || {};

          console.log('Profile response:', profile);

          if (!profile || !profile.role) {
            throw new Error('Invalid profile data received');
          }

          // Construct user object (same structure as normal login)
          const userObj = {
            id: String(profile.id ?? '1'),
            email: String(profile.email ?? ''),
            name: `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim(),
            type: profile.role as 'employer' | 'employee' | 'agent' | 'admin',
          };

          console.log('User object constructed:', userObj);

          // Store user data (same as normal login)
          localStorage.setItem('auth_user', JSON.stringify(userObj));

          // Check for stored redirect URL
          const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
          if (redirectUrl) {
            sessionStorage.removeItem('redirectAfterLogin');
            const rolePrefix = `/${userObj.type}`;
            if (redirectUrl.startsWith(rolePrefix)) {
              console.log('Redirecting to stored URL:', redirectUrl);
              window.location.replace(redirectUrl);
              return;
            }
          }

          // Redirect to appropriate dashboard (same as normal login)
          const dashboardUrl = `/${userObj.type}/dashboard`;
          console.log('Redirecting to dashboard:', dashboardUrl);
          window.location.replace(dashboardUrl);
        } catch (profileError) {
          console.error('Failed to fetch profile:', profileError);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          setMessage('Failed to load user profile. Redirecting to login...');
          setTimeout(() => {
            window.location.replace('/login');
          }, 2000);
        }
      } catch (err) {
        console.error('Google OAuth callback error:', err);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setMessage('Sign-in failed. Redirecting to login...');
        setTimeout(() => {
          window.location.replace('/login');
        }, 2000);
      }
    };

    void completeLogin();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-700 text-sm mb-4">{message}</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
