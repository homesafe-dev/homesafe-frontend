import axiosInstance from './axiosConfig';

// Suggestions API endpoints
const SUGGESTIONS_ENDPOINTS = {
  CREATE_SUGGESTION: '/suggestions',
  GET_SUGGESTIONS: '/suggestions',
  GET_SINGLE_SUGGESTION: (id: number) => `/suggestions/${id}`,
  RESPOND_TO_SUGGESTION: (id: number) => `/suggestions/${id}/respond`,
};

// Suggestion interfaces
export interface CreateSuggestionData {
  employee_id: number;
  employer_id: number;
  suggestion_reason: string;
}

export interface SuggestionResponseData {
  response: 'accepted' | 'rejected';
  working_days_per_month?: number;
  working_hours_per_week?: number;
  working_hours_schedule?: string;
  start_date?: string;
  duration_months?: number;
  terms?: string;
}

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  title?: string | null;
  username?: string | null;
  email: string;
  email_verified_at?: string | null;
  avatar?: string | null;
  gender?: string | null;
  dob?: string;
  phone?: string | null;
  address?: string;
  status: number;
  otp_code?: string | null;
  otp_expires_at?: string | null;
  otp_purpose?: string | null;
  is_verified: number;
  salary: string;
  profile_description?: string | null;
  created_by: number;
  approval_status: string;
  is_blocked: boolean;
  fcm_token?: string | null;
  password_changed_at: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  occupations?: Array<{
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    pivot: {
      user_id: number;
      occupation_id: number;
    };
  }>;
}

export interface Employer {
  id: number;
  first_name: string;
  last_name: string;
  title?: string | null;
  username?: string | null;
  email: string;
  email_verified_at?: string | null;
  avatar?: string | null;
  gender?: string | null;
  dob?: string;
  phone?: string | null;
  address?: string;
  status: number;
  otp_code?: string | null;
  otp_expires_at?: string | null;
  otp_purpose?: string | null;
  is_verified: number;
  salary: string;
  profile_description?: string | null;
  created_by: number;
  approval_status: string;
  is_blocked: boolean;
  fcm_token?: string | null;
  password_changed_at: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Agent {
  id: number;
  first_name: string;
  last_name: string;
  title?: string | null;
  username?: string | null;
  email: string;
  email_verified_at?: string | null;
  avatar?: string | null;
  gender?: string | null;
  dob?: string;
  phone?: string | null;
  address?: string;
  status: number;
  otp_code?: string | null;
  otp_expires_at?: string | null;
  otp_purpose?: string | null;
  is_verified: number;
  salary: string;
  profile_description?: string | null;
  created_by: number;
  approval_status: string;
  is_blocked: boolean;
  fcm_token?: string | null;
  password_changed_at: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface EmploymentContract {
  id: number;
  position: string;
  status: string;
}

export interface Suggestion {
  id: number;
  employee_id: number;
  employer_id: number;
  agent_id: number;
  status: 'pending' | 'accepted' | 'rejected';
  suggestion_reason: string;
  employment_contract_id?: number | null;
  created_at: string;
  updated_at: string;
  employee: Employee;
  employer: Employer;
  agent: Agent;
}

export interface SuggestionDetails {
  suggestion: {
    id: number;
    status: 'pending' | 'accepted' | 'rejected';
    suggestion_reason: string;
    created_at: string;
    updated_at: string;
  };
  employee: Employee;
  employer: Employer;
  agent: Agent;
  employment_contract?: EmploymentContract | null;
}

export interface SuggestionsListResponse {
  status: boolean;
  message: string;
  data: {
    current_page: number;
    data: Suggestion[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface SuggestionDetailsResponse {
  status: boolean;
  message: string;
  data: SuggestionDetails;
}

export interface CreateSuggestionResponse {
  status: boolean;
  message: string;
  data?: any;
}

export interface SuggestionResponseResponse {
  status: boolean;
  message: string;
  data?: any;
}

// Suggestions API service
const suggestionsApi = {
  /**
   * Create a new suggestion/recommendation
   * @param suggestionData - Suggestion creation data
   * @returns Promise with the API response
   */
  createSuggestion: async (
    suggestionData: CreateSuggestionData
  ): Promise<CreateSuggestionResponse> => {
    try {
      const response = await axiosInstance.post(
        SUGGESTIONS_ENDPOINTS.CREATE_SUGGESTION,
        suggestionData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating suggestion:', error);
      throw error;
    }
  },

  /**
   * Get all suggestions with pagination
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @returns Promise with the API response containing suggestions list
   */
  getSuggestions: async (
    page = 1,
    limit = 15
  ): Promise<SuggestionsListResponse> => {
    try {
      const response = await axiosInstance.get(
        SUGGESTIONS_ENDPOINTS.GET_SUGGESTIONS,
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      throw error;
    }
  },

  /**
   * Get a single suggestion by ID
   * @param id - Suggestion ID
   * @returns Promise with the API response containing suggestion details
   */
  getSuggestionById: async (id: number): Promise<SuggestionDetailsResponse> => {
    try {
      const response = await axiosInstance.get(
        SUGGESTIONS_ENDPOINTS.GET_SINGLE_SUGGESTION(id)
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching suggestion details:', error);
      throw error;
    }
  },

  /**
   * Respond to a suggestion (accept or reject)
   * @param id - Suggestion ID
   * @param responseData - Response data including accept/reject and contract terms
   * @returns Promise with the API response
   */
  respondToSuggestion: async (
    id: number,
    responseData: SuggestionResponseData
  ): Promise<SuggestionResponseResponse> => {
    try {
      const response = await axiosInstance.post(
        SUGGESTIONS_ENDPOINTS.RESPOND_TO_SUGGESTION(id),
        responseData
      );
      return response.data;
    } catch (error) {
      console.error('Error responding to suggestion:', error);
      throw error;
    }
  },
};

export default suggestionsApi;
