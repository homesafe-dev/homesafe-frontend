import { createContext, useContext, useState, ReactNode } from 'react';
import { AuthContextType, AuthUser, UserType, OtpResponse, RegistrationData, BiometricLoginData } from './types';
import authApi from '../api/authApi';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string, type: UserType): Promise<OtpResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login(email, password);
      setLoading(false);

      // Handle successful login
      if (response.status && response.data) {
        // Set user based on the response data
        setUser({
          id: '1', // Default ID since it's not provided in the response
          email: email,
          name: `${response.data.first_name || ''}`,
          type: response.data.role as UserType || type, // Use provided type as fallback
        });

        // Store auth token if provided
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
        }

        return {
          success: true,
          message: response.message,
          data: response.data
        };
      } else {
        return {
          success: false,
          message: response.message || 'Login failed',
          data: response.data
        };
      }
    } catch (err: any) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Failed to login';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
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
        // Set user based on the response data
        setUser({
          id: '1', // Default ID since it's not provided in the response
          email: data.email, // Use the email from the registration data
          name: `${response.data.first_name} ${response.data.last_name}`,
          type: response.data.role as UserType, // Convert role to UserType
        });

        // Store auth token if provided
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
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
        // Set user based on the response data
        setUser({
          id: '1', // Default ID since it's not provided in the response
          email: response.data.email || '', // Email might be provided in the response
          name: `${response.data.first_name} ${response.data.last_name}`,
          type: response.data.role as UserType, // Convert role to UserType
        });

        // Store auth token if provided
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
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
        sendOTP,
        verifyOTP,
        completeRegistration,
        biometricLogin,
        loading,
        error
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
