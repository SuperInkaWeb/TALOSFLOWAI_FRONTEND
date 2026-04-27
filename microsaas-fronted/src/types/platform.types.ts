export type PlatformLoginRequest = {
  email: string;
  password: string;
};

export type PlatformLoginResponse = {
  token: string;
  platformUserId: number;
  role: string;
  scope: "PLATFORM";
};

export type PlatformOrganizationItem = {
  id: number;
  name: string;
  slug: string;
  schemaName: string;
  status: string;
  schemaReady: boolean;
  schemaReadyAt?: string | null;
  provisioningError?: string | null;
  referralCode?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  planName?: string | null;
};

export type PlatformOrganizationDetailResponse = {
  organization: {
    id: number;
    name: string;
    slug: string;
    schemaName: string;
    status: string;
    referralCode?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  };
  provisioning: {
    schemaReady: boolean;
    schemaReadyAt?: string | null;
    provisioningError?: string | null;
  };
  billing?: {
    subscriptionId: number;
    status: string;
    provider: string;
    billingPeriod: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    trialEndsAt?: string | null;
    canceledAt?: string | null;
    endedAt?: string | null;
    providerCustomerId?: string | null;
    providerSubscriptionId?: string | null;
    providerPriceId?: string | null;
    planId: number;
    effectivePlanId: number;
  } | null;
  usage?: {
    periodStart: string;
    periodEnd: string;
    postsUsed: number;
    aiUsed: number;
    imageGenerationsUsed: number;
    bonusPosts: number;
    bonusAi: number;
    bonusImages: number;
  } | null;
  branding?: {
    brandProfileId: number;
    brandName: string;
    legalName?: string | null;
    businessDescription?: string | null;
    logoUrl?: string | null;
    primaryColor?: string | null;
    secondaryColor?: string | null;
    accentColor?: string | null;
    backgroundColor?: string | null;
    textColor?: string | null;
    defaultCtaText?: string | null;
    defaultCtaEnabled: boolean;
    showLogoByDefault: boolean;
    showCtaByDefault: boolean;
    showContactByDefault: boolean;
    showSocialsByDefault: boolean;
    socialLinksCount: number;
    activeSocialLinksCount: number;
    isCompleted: boolean;
    isActive: boolean;
  } | null;
  social: {
    connectedAccountsCount: number;
    activeAccountsCount: number;
    pagesCount: number;
  };
  users: {
    total: number;
    owners: number;
    admins: number;
    editors: number;
    viewers: number;
    recentUsers: Array<{
      id: number;
      name: string;
      email: string;
      role: string;
      active: boolean;
      mustChangePassword: boolean;
      createdAt?: string | null;
      updatedAt?: string | null;
    }>;
  };
  posts: {
    total: number;
    drafts: number;
    scheduled: number;
    processing: number;
    published: number;
    failed: number;
    canceled: number;
    recentPosts: Array<{
      id: number;
      contentPreview?: string | null;
      mediaUrl?: string | null;
      status: string;
      scheduledAt?: string | null;
      publishedAt?: string | null;
      errorMessage?: string | null;
      createdAt?: string | null;
      createdByName?: string | null;
    }>;
  };
  recentAuditLogs: Array<{
    id: number;
    platformUserId: number;
    action: string;
    targetType: string;
    targetId?: number | null;
    organizationId?: number | null;
    metadataJson?: string | null;
    createdAt?: string | null;
  }>;
};

export type UpdatePlatformOrganizationStatusRequest = {
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE"
};

export type PlatformLoginAttemptItem = {
  id: number;
  slug: string;
  email: string;
  ipAddress: string;
  success: boolean;
  reason?: string | null;
  createdAt: string;
};

export type PlatformLoginAttemptSummary = {
  totalAttempts: number;
  failedAttempts: number;
  successfulAttempts: number;
  uniqueIpCount: number;
  uniqueAccountCount: number;
};

export type PlatformLoginAttemptsPageResponse = {
  content: PlatformLoginAttemptItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

export type PlatformLoginAttemptsQuery = {
  slug?: string;
  email?: string;
  ipAddress?: string;
  success?: boolean;
  page?: number;
  size?: number;
};