import { api } from "./api";
import type {
  BillingCheckoutSessionResponse,
  BillingPlanResponse,
  BillingPortalResponse,
  BillingSubscriptionResponse,
  BillingUsageResponse,
} from "../types/billing.types";

export const billingService = {
  async getPlans(): Promise<BillingPlanResponse[]> {
    const { data } = await api.get<BillingPlanResponse[]>("/billing/plans");
    return data;
  },

  async getSubscription(): Promise<BillingSubscriptionResponse> {
    const { data } = await api.get<BillingSubscriptionResponse>(
      "/billing/subscription"
    );
    return data;
  },

  async getUsage(): Promise<BillingUsageResponse> {
    const { data } = await api.get<BillingUsageResponse>("/billing/usage");
    return data;
  },

  async createCheckoutSession(planId: number): Promise<string> {
    const { data } = await api.post<BillingCheckoutSessionResponse>(
      `/billing/checkout-session/${planId}`
    );
    return data.url;
  },

  async createCustomerPortal(): Promise<string> {
    const { data } = await api.post<BillingPortalResponse>(
      "/billing/customer-portal"
    );
    return data.url;
  },
};