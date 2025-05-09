import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthContextType, AuthUser, UserType, OtpResponse, RegistrationData, BiometricLoginData } from './types';
import authApi from '../api/authApi';
import axiosInstance from '../api/axiosConfig';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);

  // Define logout function first to avoid reference issues
  const logout = () => {
    console.log('[AuthContext] Logging out user');
    setUser(null);
    console.log('[AuthContext] User state cleared');

    // Check if items exist before removing
    const hasToken = !!localStorage.getItem('auth_token');
    const hasUser = !!localStorage.getItem('auth_user');
    console.log('[AuthContext] Before logout - Token exists:', hasToken);
    console.log('[AuthContext] Before logout - User exists:', hasUser);

    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    // Verify items were removed
    const tokenAfter = localStorage.getItem('auth_token');
    const userAfter = localStorage.getItem('auth_user');
    console.log('[AuthContext] After logout - Token exists:', !!tokenAfter);
    console.log('[AuthContext] After logout - User exists:', !!userAfter);

    // Ensure auth is marked as initialized after logout
    setAuthInitialized(true);

    // Redirect to login page can be handled by the component that calls logout
    console.log('[AuthContext] Logout complete');
  };

  // Function to check if token is valid
  const checkTokenValidity = async (token: string) => {
    console.log('[AuthContext] Checking token validity');
    try {
      // Make a test request to a protected endpoint
      const response = await axiosInstance.get('/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('[AuthContext] Token validation response:', response.status);
      return response.status === 200;
    } catch (error) {
      console.error('[AuthContext] Token validation failed:', error);
      return false;
    }
  };

  // Check for existing auth data on mount and validate token
  useEffect(() => {
    console.log('[AuthContext] Initializing auth state');
    // Set auth as not initialized initially
    setAuthInitialized(false);

    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    console.log('[AuthContext] Token exists:', !!token);
    console.log('[AuthContext] User data exists:', !!storedUser);

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as AuthUser;
        console.log('[AuthContext] Parsed user:', parsedUser);
        setUser(parsedUser);
        console.log('[AuthContext] User state set successfully');

        // Add a flag to indicate this is a page refresh
        // This helps prevent unnecessary API calls that might trigger 401 errors
        sessionStorage.setItem('is_page_refresh', 'true');
        console.log('[AuthContext] Set page refresh flag in sessionStorage');

        // Clear the flag after a short delay
        setTimeout(() => {
          sessionStorage.removeItem('is_page_refresh');
          console.log('[AuthContext] Cleared page refresh flag after timeout');
        }, 10000); // Increased timeout to 10 seconds

        // Validate token in background (don't wait for it)
        checkTokenValidity(token).then(isValid => {
          console.log('[AuthContext] Token validation result:', isValid);
          if (!isValid) {
            console.warn('[AuthContext] Token is invalid, logging out');
            logout();
          }
          // Mark auth as initialized regardless of token validity
          setAuthInitialized(true);
          console.log('[AuthContext] Auth initialization complete');
        });

      } catch (error) {
        console.error('[AuthContext] Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        console.log('[AuthContext] Cleared invalid auth data from localStorage');
        // Mark auth as initialized even if there was an error
        setAuthInitialized(true);
        console.log('[AuthContext] Auth initialization complete (with error)');
      }
    } else {
      console.log('[AuthContext] No auth data found in localStorage');
      // Mark auth as initialized even if no auth data was found
      setAuthInitialized(true);
      console.log('[AuthContext] Auth initialization complete (no auth data)');
    }
  }, []);

  const login = async (email: string, password: string, type: UserType): Promise<OtpResponse> => {
    console.log('[AuthContext] Login attempt:', { email, type });
    setLoading(true);
    setError(null);

    try {
      console.log('[AuthContext] Calling login API');
      const response = await authApi.login(email, password);
      console.log('[AuthContext] Login API response:', response);
      setLoading(false);

      // Handle successful login
      if (response.status && response.data) {
        console.log('[AuthContext] Login successful, processing user data');

        // Create user object based on the response data
        const userObj = {
          id: response.data.id || '1', // Use ID from response if available
          email: email,
          name: `${response.data.first_name || ''}`,
          type: response.data.role as UserType || type, // Use provided type as fallback
        };

        console.log('[AuthContext] Created user object:', userObj);

        // Set user in state
        setUser(userObj);
        console.log('[AuthContext] User state updated');

        // Store auth token and user data if provided
        if (response.data.token) {
          console.log('[AuthContext] Storing auth token in localStorage');
          localStorage.setItem('auth_token', response.data.token);
          localStorage.setItem('auth_user', JSON.stringify(userObj));
          console.log('[AuthContext] Auth data stored in localStorage');

          // Verify the data was stored correctly
          const storedToken = localStorage.getItem('auth_token');
          const storedUser = localStorage.getItem('auth_user');
          console.log('[AuthContext] Verification - Token stored:', !!storedToken);
          console.log('[AuthContext] Verification - User stored:', !!storedUser);
        } else {
          console.warn('[AuthContext] No token in response data');
        }

        // Ensure auth is marked as initialized after login
        setAuthInitialized(true);

        return {
          success: true,
          message: response.message,
          data: response.data
        };
      } else {
        console.warn('[AuthContext] Login response indicates failure:', response.message);
        return {
          success: false,
          message: response.message || 'Login failed',
          data: response.data
        };
      }
    } catch (err: any) {
      console.error('[AuthContext] Login error:', err);
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Failed to login';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  };



  /**
   * Check if the current user has the specified role(s)
   * @param role - A single role or array of roles to check against
   * @returns boolean indicating if the user has the specified role
   */
  const hasRole = (role: UserType | UserType[]): boolean => {
    if (!user) return false;

    if (Array.isArray(role)) {
      return role.includes(user.type);
    }

    return user.type === role;
  };

  const sendOTP = async (email: string): Promise<OtpResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.sendOTP(email);
      setLoading(false);
      return {
        success: true,
        message: 'OTP sent successfully',
        data: response
      };
    } catch (err: any) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Failed to send OTP';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<OtpResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.verifyOTP(email, otp);
      setLoading(false);
      return {
        success: true,
        message: 'OTP verified successfully',
        data: response
      };
    } catch (err: any) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Failed to verify OTP';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const completeRegistration = async (data: RegistrationData): Promise<OtpResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.completeRegistration(data);
      setLoading(false);

      // Handle the response based on the format provided
      if (response.status && response.data) {
        // Create user object based on the response data
        const userObj = {
          id: response.data.id || '1', // Use ID from response if available
          email: data.email, // Use the email from the registration data
          name: `${response.data.first_name} ${response.data.last_name}`,
          type: response.data.role as UserType, // Convert role to UserType
        };

        // Set user in state
        setUser(userObj);

        // Store auth token and user data if provided
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
          localStorage.setItem('auth_user', JSON.stringify(userObj));
        }
      }

      return {
        success: response.status,
        message: response.message,
        data: response.data
      };
    } catch (err: any) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Failed to complete registration';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const biometricLogin = async (data: BiometricLoginData): Promise<OtpResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.biometricLogin(
        data.device_id,
        data.challenge,
        data.signature
      );
      setLoading(false);

      // Handle successful biometric login
      if (response.status && response.data) {
        // Create user object based on the response data
        const userObj = {
          id: response.data.id || '1', // Use ID from response if available
          email: response.data.email || '', // Email might be provided in the response
          name: `${response.data.first_name} ${response.data.last_name}`,
          type: response.data.role as UserType, // Convert role to UserType
        };

        // Set user in state
        setUser(userObj);

        // Store auth token and user data if provided
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
          localStorage.setItem('auth_user', JSON.stringify(userObj));
        }
      }

      return {
        success: response.status,
        message: response.message,
        data: response.data
      };
    } catch (err: any) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Failed to authenticate with biometrics';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
        sendOTP,
        verifyOTP,
        completeRegistration,
        biometricLogin,
        loading,
        error,
        authInitialized
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext };
