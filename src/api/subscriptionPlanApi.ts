import axiosInstance from './axiosConfig';

const SUBSCRIPTION_PLAN_ENDPOINTS = {
  LIST: '/admin/subscription-plans',
};

export interface SubscriptionPlan {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  price_monthly: string | number;
  price_yearly: string | number;
  artisan_commission_percent: string | number;
  job_proposal_limit?: number | null;
  is_active: boolean;
  is_default: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface SubscriptionPlanPayload {
  slug: string;
  name: string;
  description?: string;
  price_monthly: number;
  price_yearly: number;
  artisan_commission_percent: number;
  job_proposal_limit?: number | null;
  is_active?: boolean;
  is_default?: boolean;
  sort_order?: number;
}

const subscriptionPlanApi = {
  getSubscriptionPlans: async () => {
    const response = await axiosInstance.get(SUBSCRIPTION_PLAN_ENDPOINTS.LIST);
    return response.data;
  },

  createSubscriptionPlan: async (payload: SubscriptionPlanPayload) => {
    const response = await axiosInstance.post(
      SUBSCRIPTION_PLAN_ENDPOINTS.LIST,
      payload
    );
    return response.data;
  },

  updateSubscriptionPlan: async (
    id: number,
    payload: Partial<SubscriptionPlanPayload>
  ) => {
    const response = await axiosInstance.put(
      `${SUBSCRIPTION_PLAN_ENDPOINTS.LIST}/${id}`,
      payload
    );
    return response.data;
  },

  deleteSubscriptionPlan: async (id: number) => {
    const response = await axiosInstance.delete(
      `${SUBSCRIPTION_PLAN_ENDPOINTS.LIST}/${id}`
    );
    return response.data;
  },
};

export default subscriptionPlanApi;
