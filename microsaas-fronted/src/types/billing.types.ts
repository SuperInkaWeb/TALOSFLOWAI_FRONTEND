export type BillingSubscriptionStatus =
  | "ACTIVE"
  | "TRIALING"
  | "PAST_DUE"
  | "CANCELED"
  | "EXPIRED";

export type BillingProvider = "INTERNAL" | "STRIPE";

export type BillingPeriod = "MONTHLY" | "YEARLY" | "LIFETIME";

export type BillingSubscriptionResponse = {
  organizationId: number;
  subscriptionId: number;
  planId: number;
  planCode: string;
  planName: string;
  status: BillingSubscriptionStatus;
  provider: BillingProvider;
  billingPeriod: BillingPeriod;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  providerCustomerId?: string | null;
  providerSubscriptionId?: string | null;
  providerPriceId?: string | null;
  maxPosts: number;
  maxAiGenerations: number;
  maxSocialAccounts: number;
  trialEndsAt?: string | null;
  canceledAt?: string | null;
  endedAt?: string | null;
};

export type BillingPortalResponse = {
  url: string;
};

export type BillingUsageResponse = {
  organizationId: number;
  planName: string;
  subscriptionStatus: string;
  periodStart: string;
  periodEnd: string;
  postsUsed: number;
  postsLimit: number;
  postsRemaining: number;
  postsUsedPercent: number;
  aiUsed: number;
  aiLimit: number;
  aiRemaining: number;
  aiUsedPercent: number;
  socialAccountsUsed: number;
  socialAccountsLimit: number;
  socialAccountsRemaining: number;
  socialAccountsUsedPercent: number;
  canPublish: boolean;
  warnings: string[];
};



export type BillingCheckoutSessionResponse = {
  url: string;
};