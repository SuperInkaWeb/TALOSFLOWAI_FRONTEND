export type BillingSubscriptionStatus =
  | "ACTIVE"
  | "TRIALING"
  | "PAST_DUE"
  | "CANCELED"
  | "EXPIRED"
  | "INCOMPLETE";

export type BillingProvider = "INTERNAL" | "STRIPE";

export type BillingPeriod = "MONTHLY" | "YEARLY" | "LIFETIME";

export type BillingWarningCode =
  | "POSTS_LIMIT_REACHED"
  | "LOW_POSTS_REMAINING"
  | "AI_LIMIT_REACHED"
  | "LOW_AI_REMAINING"
  | "IMAGES_LIMIT_REACHED"
  | "LOW_IMAGES_REMAINING"
  | "SOCIAL_ACCOUNTS_LIMIT_REACHED"
  | "LOW_SOCIAL_ACCOUNTS_REMAINING";

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
  maxImageGenerations: number;
  maxSocialAccounts: number;

  allowScheduling: boolean;
  allowMultiPage: boolean;
  allowPremiumAi: boolean;
  allowPremiumImages: boolean;
  allowAbTesting: boolean;
  allowApprovalFlow: boolean;

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
  subscriptionStatus: BillingSubscriptionStatus;
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

  imagesUsed: number;
  imagesLimit: number;
  imagesRemaining: number;
  imagesUsedPercent: number;

  socialAccountsUsed: number;
  socialAccountsLimit: number;
  socialAccountsRemaining: number;
  socialAccountsUsedPercent: number;

  canPublish: boolean;
  warnings: BillingWarningCode[];
};

export type BillingCheckoutSessionResponse = {
  url: string;
};

export type BillingPlanResponse = {
  id: number;
  code: string;
  name: string;
  billingPeriod: BillingPeriod;
  priceCents: number;
  currency: string;

  maxPosts: number;
  maxAiGenerations: number;
  maxImageGenerations: number;
  maxSocialAccounts: number;
  maxAdmins: number;
  maxEditors: number;
  maxViewers: number;

  allowScheduling: boolean;
  allowMultiPage: boolean;
  allowPremiumAi: boolean;
  allowPremiumImages: boolean;
  allowAbTesting: boolean;
  allowApprovalFlow: boolean;

  trialDays: number;
  sortOrder: number;
  isPublic: boolean;
  isActive: boolean;
};