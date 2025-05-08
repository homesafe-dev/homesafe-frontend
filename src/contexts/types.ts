export type UserType = 'employer' | 'employee' | 'agent';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  type: UserType;
}

export interface OtpResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface RegistrationData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  gender: string;
  is_employer?: boolean;
  facial_image?: string;
}

export interface BiometricLoginData {
  device_id: string;
  challenge: string;
  signature: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, type: UserType) => Promise<OtpResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  sendOTP: (email: string) => Promise<OtpResponse>;
  verifyOTP: (email: string, otp: string) => Promise<OtpResponse>;
  completeRegistration: (data: RegistrationData) => Promise<OtpResponse>;
  biometricLogin: (data: BiometricLoginData) => Promise<OtpResponse>;
  loading: boolean;
  error: string | null;
}
