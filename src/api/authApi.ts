import axiosInstance from './axiosConfig';

// Auth API endpoints
const AUTH_ENDPOINTS = {
  SEND_OTP: '/send-otp',
  VERIFY_OTP: '/verify-otp',
  COMPLETE_REGISTRATION: '/complete-registration',
  BIOMETRIC_LOGIN: '/biometric-login',
  REGISTER: '/register',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_FORGOT_PASSWORD_OTP: '/verify-forgot-password-otp',
  RESET_PASSWORD: '/reset-password',
  CHANGE_PASSWORD: '/change-password',
  LOGOUT: '/logout',
  VERIFY_TFA_LOGIN: '/tfa/verify-login',
  RESEND_TFA_LOGIN_CODE: '/tfa/resend-login-code',
};

// Auth API service
const authApi = {
  /**
   * Send OTP to user's email
   * @param email - User's email address
   * @returns Promise with the API response
   */
  sendOTP: async (email: string, recaptchaToken?: string) => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.SEND_OTP, {
      email,
      ...(recaptchaToken ? { recaptcha_token: recaptchaToken } : {}),
    });
    return response.data;
  },

  /**
   * Verify OTP entered by user
   * @param email - User's email address
   * @param otp - OTP entered by user
   * @returns Promise with the API response
   */
  verifyOTP: async (email: string, otp: string) => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.VERIFY_OTP, {
      email,
      otp_code: otp,
    });
    return response.data;
  },

  /**
   * Complete user registration with personal details and profile image
   * @param registrationData - User registration data including email, password, name, etc. or FormData
   * @returns Promise with the API response
   */
  completeRegistration: async (
    registrationData:
      | {
          email: string;
          password: string;
          first_name: string;
          last_name: string;
          phone: string;
          address: string;
          gender: string;
          is_employer?: boolean;
          facial_image?: string;
          occupation?: number;
        }
      | FormData
  ) => {
    let payload;
    let config = {};

    // Check if registrationData is FormData
    if (registrationData instanceof FormData) {
      // Use FormData as is
      payload = registrationData;

      // Set headers for multipart/form-data
      config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
    } else {
      // Create a copy of the registration data
      payload = { ...registrationData };

      // Ensure is_employer is a boolean
      if (typeof payload.is_employer !== 'undefined') {
        payload.is_employer = Boolean(payload.is_employer);
      }
    }

    const response = await axiosInstance.post(
      AUTH_ENDPOINTS.COMPLETE_REGISTRATION,
      payload,
      config
    );
    return response.data;
  },

  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Promise with the API response
   */
  register: async (userData: Record<string, unknown>) => {
    const response = await axiosInstance.post(
      AUTH_ENDPOINTS.REGISTER,
      userData
    );
    return response.data;
  },

  /**
   * Login user
   * @param email - User's email
   * @param password - User's password
   * @returns Promise with the API response
   */
  login: async (email: string, password: string, recaptchaToken?: string) => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, {
      email,
      password,
      ...(recaptchaToken ? { recaptcha_token: recaptchaToken } : {}),
    });
    return response.data;
  },

  /**
   * Biometric login
   * @param deviceId - Device identifier
   * @param challenge - Random challenge string
   * @param signature - Base64 encoded signature
   * @returns Promise with the API response
   */
  biometricLogin: async (
    deviceId: string,
    challenge: string,
    signature: string
  ) => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.BIOMETRIC_LOGIN, {
      device_id: deviceId,
      challenge: challenge,
      signature: signature,
    });
    return response.data;
  },

  /**
   * Logout user
   * @returns Promise with the API response
   */
  logout: async () => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGOUT);
    return response.data;
  },

  /**
   * Send forgot password request
   * @param email - User's email address
   * @returns Promise with the API response
   */
  forgotPassword: async (email: string, recaptchaToken?: string) => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
      email,
      ...(recaptchaToken ? { recaptcha_token: recaptchaToken } : {}),
    });
    return response.data;
  },

  /**
   * Verify forgot password OTP
   * @param email - User's email address
   * @param otp - OTP entered by user
   * @returns Promise with the API response
   */
  verifyForgotPasswordOTP: async (email: string, otp: string) => {
    const response = await axiosInstance.post(
      AUTH_ENDPOINTS.VERIFY_FORGOT_PASSWORD_OTP,
      {
        email,
        otp_code: otp,
      }
    );
    return response.data;
  },

  /**
   * Reset user password
   * @param email - User's email address
   * @param resetToken - One-time token returned by verifyForgotPasswordOTP
   * @param password - New password
   * @returns Promise with the API response
   */
  resetPassword: async (
    email: string,
    resetToken: string,
    password: string
  ) => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
      email,
      reset_token: resetToken,
      password,
    });
    return response.data;
  },

  /**
   * Change password (authenticated — e.g. first-login with temp password).
   * @param oldPassword - Current or temporary password
   * @param newPassword - New password
   * @param token - Optional bearer token when session is not stored yet
   */
  changePassword: async (
    oldPassword: string,
    newPassword: string,
    token?: string
  ) => {
    const response = await axiosInstance.post(
      AUTH_ENDPOINTS.CHANGE_PASSWORD,
      {
        old_password: oldPassword,
        new_password: newPassword,
      },
      token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined
    );
    return response.data;
  },

  /**
   * Verify TFA login challenge
   */
  verifyTfaLogin: async (email: string, tfaToken: string, code: string) => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.VERIFY_TFA_LOGIN, {
      email,
      tfa_token: tfaToken,
      code,
    });
    return response.data;
  },

  /**
   * Resend TFA login code for pending challenge
   */
  resendTfaLoginCode: async (email: string, tfaToken: string) => {
    const response = await axiosInstance.post(
      AUTH_ENDPOINTS.RESEND_TFA_LOGIN_CODE,
      {
        email,
        tfa_token: tfaToken,
      }
    );
    return response.data;
  },
};

export default authApi;
