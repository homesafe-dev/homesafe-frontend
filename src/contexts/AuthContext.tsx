import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import {
  AuthContextType,
  AuthUser,
  UserType,
  OtpResponse,
  RegistrationData,
  BiometricLoginData,
} from './types';
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
    setUser(null);

    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    // Ensure auth is marked as initialized after logout
    setAuthInitialized(true);
  };

  // Function to check if token is valid
  const checkTokenValidity = async (token: string) => {
    try {
      // Make a test request to a protected endpoint
      const response = await axiosInstance.get('/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.status === 200;
    } catch {
      return false;
    }
  };

  // Check for existing auth data on mount and validate token
  useEffect(() => {
    // Set auth as not initialized initially
    setAuthInitialized(false);

    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as AuthUser;

        setUser(parsedUser);

        // Add a flag to indicate this is a page refresh
        // This helps prevent unnecessary API calls that might trigger 401 errors
        sessionStorage.setItem('is_page_refresh', 'true');

        // Clear the flag after a short delay
        setTimeout(() => {
          sessionStorage.removeItem('is_page_refresh');
        }, 10000); // Increased timeout to 10 seconds

        // Validate token in background (don't wait for it)
        checkTokenValidity(token).then((isValid) => {
          if (!isValid) {
            console.warn('[AuthContext] Token is invalid, logging out');
            logout();
          }
          // Mark auth as initialized regardless of token validity
          setAuthInitialized(true);
        });
      } catch (error) {
        console.error('[AuthContext] Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        // Mark auth as initialized even if there was an error
        setAuthInitialized(true);
      }
    } else {
      // Mark auth as initialized even if no auth data was found
      setAuthInitialized(true);
    }
  }, []);

  const login = async (
    email: string,
    password: string,
    type: UserType
  ): Promise<OtpResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login(email, password);
      setLoading(false);

      // Handle successful login
      if (response.status && response.data) {
        // Create user object based on the response data
        const userObj = {
          id: response.data.id || '1', // Use ID from response if available
          email: email,
          name: `${response.data.first_name || ''}`,
          type: (response.data.role as UserType) || type, // Use provided type as fallback
        };

        // Set user in state
        setUser(userObj);

        // Store auth token and user data if provided
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
          localStorage.setItem('auth_user', JSON.stringify(userObj));
        } else {
          console.warn('[AuthContext] No token in response data');
        }

        // Ensure auth is marked as initialized after login
        setAuthInitialized(true);

        return {
          success: true,
          message: response.message,
          data: response.data,
        };
      } else {
        console.warn(
          '[AuthContext] Login response indicates failure:',
          response.message
        );
        return {
          success: false,
          message: response.message || 'Login failed',
          data: response.data,
        };
      }
    } catch (err: any) {
      console.error('[AuthContext] Login error:', err);
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Failed to login';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
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
        data: response,
      };
    } catch (err: any) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Failed to send OTP';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const verifyOTP = async (
    email: string,
    otp: string
  ): Promise<OtpResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.verifyOTP(email, otp);
      setLoading(false);
      return {
        success: true,
        message: 'OTP verified successfully',
        data: response,
      };
    } catch (err: any) {
      setLoading(false);
      const errorMessage =
        err.response?.data?.message || 'Failed to verify OTP';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const completeRegistration = async (
    data: RegistrationData | FormData
  ): Promise<OtpResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.completeRegistration(data);
      setLoading(false);

      if (response.status && response.data) {
        const userObj = {
          id: response.data.id || '1',
          email:
            data instanceof FormData
              ? (data.get('email') as string)
              : data.email,
          name: `${response.data.first_name} ${response.data.last_name}`,
          type: response.data.role as UserType,
        };

        setUser(userObj);

        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
          localStorage.setItem('auth_user', JSON.stringify(userObj));
      }

      return {
          success: true,
        message: response.message,
        data: response.data,
      };
      } else {
        return {
          success: false,
          message: response.message || 'Registration failed',
          data: response.data,
        };
      }
    } catch (err: any) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const biometricLogin = async (
    data: BiometricLoginData
  ): Promise<OtpResponse> => {
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
        data: response.data,
      };
    } catch (err: any) {
      setLoading(false);
      const errorMessage =
        err.response?.data?.message || 'Failed to authenticate with biometrics';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
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
        authInitialized,
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
