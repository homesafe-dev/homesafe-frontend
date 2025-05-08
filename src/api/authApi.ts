import axiosInstance from './axiosConfig';

// Auth API endpoints
const AUTH_ENDPOINTS = {
  SEND_OTP: '/api/send-otp',
  VERIFY_OTP: '/api/verify-otp',
  COMPLETE_REGISTRATION: '/api/complete-registration',
  BIOMETRIC_LOGIN: '/api/biometric-login',
  REGISTER: '/api/register',
  LOGIN: '/api/login',
  FORGOT_PASSWORD: '/api/forgot-password',
  VERIFY_FORGOT_PASSWORD_OTP: '/api/verify-forgot-password-otp',
  RESET_PASSWORD: '/api/reset-password',
  LOGOUT: '/api/logout',
};

// Auth API service
const authApi = {
  /**
   * Send OTP to user's email
   * @param email - User's email address
   * @returns Promise with the API response
   */
  sendOTP: async (email: string) => {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.SEND_OTP, {
        email,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify OTP entered by user
   * @param email - User's email address
   * @param otp - OTP entered by user
   * @returns Promise with the API response
   */
  verifyOTP: async (email: string, otp: string) => {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.VERIFY_OTP, {
        email,
        otp_code: otp,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Complete user registration with personal details and facial image
   * @param registrationData - User registration data including email, password, name, etc.
   * @returns Promise with the API response
   */
  completeRegistration: async (registrationData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string;
    address: string;
    gender: string;
    is_employer?: boolean;
    facial_image?: string;
  }) => {
    try {
      // Create a copy of the registration data
      const payload = { ...registrationData };

      // Ensure is_employer is a boolean
      if (typeof payload.is_employer !== 'undefined') {
        payload.is_employer = Boolean(payload.is_employer);
      }

      // Log the payload for debugging
      console.log('Registration payload:', {
        ...payload,
        facial_image: payload.facial_image ? '[BASE64_IMAGE]' : undefined
      });

      const response = await axiosInstance.post(
        AUTH_ENDPOINTS.COMPLETE_REGISTRATION,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Promise with the API response
   */
  register: async (userData: any) => {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Login user
   * @param email - User's email
   * @param password - User's password
   * @returns Promise with the API response
   */
  login: async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Biometric login
   * @param deviceId - Device identifier
   * @param challenge - Random challenge string
   * @param signature - Base64 encoded signature
   * @returns Promise with the API response
   */
  biometricLogin: async (deviceId: string, challenge: string, signature: string) => {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.BIOMETRIC_LOGIN, {
        device_id: deviceId,
        challenge: challenge,
        signature: signature,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout user
   * @returns Promise with the API response
   */
  logout: async () => {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGOUT);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Send forgot password request
   * @param email - User's email address
   * @returns Promise with the API response
   */
  forgotPassword: async (email: string) => {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
        email,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify forgot password OTP
   * @param email - User's email address
   * @param otp - OTP entered by user
   * @returns Promise with the API response
   */
  verifyForgotPasswordOTP: async (email: string, otp: string) => {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.VERIFY_FORGOT_PASSWORD_OTP, {
        email,
        otp_code: otp,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reset user password
   * @param email - User's email address
   * @param password - New password
   * @returns Promise with the API response
   */
  resetPassword: async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authApi;
