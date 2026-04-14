// src/types/referral.types.ts
export type ReferralSummaryResponse = {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  pendingReferrals: number;
  rewardedReferrals: number;
  rewardedThisMonth: number;
  bonusAi: number;
  bonusImages: number;
};

export type ReferralListItemResponse = {
  id: number;
  referredOrganizationId: number;
  referredOrganizationName: string | null;
  referredOrganizationSlug: string | null;
  referralCode: string;
  status: "PENDING" | "QUALIFIED" | "REWARDED" | "REJECTED";
  rewardAiAmount: number;
  rewardImageAmount: number;
  qualifiedAt: string | null;
  rewardedAt: string | null;
  createdAt: string;
};