import React from 'react';
import axiosInstance from '../../api/axiosConfig';

const GoogleAuthCallback: React.FC = () => {
  const [message, setMessage] = React.useState<string>('Completing sign-in...');

  React.useEffect(() => {
    const completeLogin = async () => {
      try {
        const pageText = document.body.innerText;

        let jsonData;
        try {
          jsonData = JSON.parse(pageText);
        } catch {
          // Not JSON, continue with URL params
        }

        if (jsonData && jsonData.redirect_url) {
          if (jsonData.status === false && jsonData.error) {
            console.error('OAuth error:', jsonData.error);
            setMessage(
              `OAuth error: ${jsonData.error}. Redirecting to login...`
            );
            setTimeout(() => {
              window.location.replace('/login');
            }, 2000);
            return;
          }

          window.location.href = jsonData.redirect_url;
          return;
        } else {
          const params = new URLSearchParams(window.location.search);
          const token = params.get('token');
          const error = params.get('error');

          if (error) {
            setMessage(`OAuth error: ${error}. Redirecting to login...`);
            setTimeout(() => {
              window.location.replace('/login');
            }, 2000);
            return;
          }

          if (!token) {
            console.error('Missing authentication token');
            setMessage('Missing authentication token. Redirecting to login...');
            setTimeout(() => {
              window.location.replace('/login');
            }, 2000);
            return;
          }

          localStorage.setItem('auth_token', token);

          try {
            const profileResponse = await axiosInstance.get('/profile');
            const profile =
              profileResponse?.data?.data || profileResponse?.data || {};

            if (!profile || !profile.role) {
              throw new Error('Invalid profile data received');
            }

            const userObj = {
              id: String(profile.id),
              email: String(profile.email),
              name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
              type: profile.role[0] as
                | 'employer'
                | 'employee'
                | 'agent'
                | 'admin',
            };

            localStorage.setItem('auth_user', JSON.stringify(userObj));

            const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
            if (redirectUrl) {
              sessionStorage.removeItem('redirectAfterLogin');
              const rolePrefix = `/${userObj.type}`;
              if (redirectUrl.startsWith(rolePrefix)) {
                window.location.replace(redirectUrl);
                return;
              }
            }

            // Redirect to appropriate dashboard
            const dashboardUrl = `/${userObj.type}/dashboard`;
            window.location.replace(dashboardUrl);
          } catch (profileError: any) {
            console.error('Failed to fetch user profile:', profileError);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            setMessage('Failed to load user profile. Redirecting to login...');
            setTimeout(() => {
              window.location.replace('/login');
            }, 2000);
          }
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
