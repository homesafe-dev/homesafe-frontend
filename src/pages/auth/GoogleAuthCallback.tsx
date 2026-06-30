import React from 'react';
import axiosInstance from '../../api/axiosConfig';
import {
  AuthSplitPage,
  AuthHeader,
} from '../../components/auth/shared/AuthLayout';
import { authTokens } from '../../components/auth/shared/authTokens.ts';
import { oauthErrorRedirectPath } from '../../utils/googleAuth';

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
            setMessage(`OAuth error: ${jsonData.error}. Redirecting...`);
            setTimeout(() => {
              window.location.replace(
                oauthErrorRedirectPath(String(jsonData.error))
              );
            }, 2000);
            return;
          }

          window.location.href = jsonData.redirect_url;
          return;
        } else {
          const params = new URLSearchParams(window.location.search);
          const token = params.get('token');
          const error = params.get('error');
          const googleSignup = params.get('google_signup');
          const profileIncomplete = params.get('profile_incomplete');

          console.log('GoogleAuthCallback - URL Parameters:', {
            token: !!token,
            error,
            googleSignup,
            profileIncomplete,
            allParams: Object.fromEntries(params.entries()),
          });

          if (error) {
            console.error('OAuth error:', error);
            setMessage(`OAuth error: ${error}. Redirecting...`);
            setTimeout(() => {
              window.location.replace(oauthErrorRedirectPath(error));
            }, 2000);
            return;
          }

          if (googleSignup === 'true') {
            setMessage('Redirecting to profile completion...');
            const currentParams = window.location.search;
            window.location.replace(
              `/auth/google/profile-completion${currentParams}`
            );
            return;
          }

          if (profileIncomplete === 'true') {
            setMessage('Redirecting to profile completion...');
            const currentParams = window.location.search;
            window.location.replace(
              `/auth/google/profile-completion${currentParams}`
            );
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

            const dashboardUrl = `/${userObj.type}/dashboard`;
            window.location.replace(dashboardUrl);
          } catch (profileError: unknown) {
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
    <AuthSplitPage hideBrandLogo>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AuthHeader title="Signing you in" subtitle={message} />
        <div
          className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent mx-auto"
          style={{
            borderColor: authTokens.fieldBorder,
            borderTopColor: authTokens.primaryDark,
          }}
          aria-hidden
        />
      </div>
    </AuthSplitPage>
  );
};

export default GoogleAuthCallback;
