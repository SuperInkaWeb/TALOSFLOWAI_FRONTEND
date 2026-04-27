import { useBillingSubscription } from "./use-billing-subscription";
import type { BillingSubscriptionStatus } from "../../../types/billing.types";

const ACCESS_ENABLED_STATUSES: BillingSubscriptionStatus[] = [
  "ACTIVE",
  "TRIALING",
];

export function usePlanAccess() {
  const { data, isLoading, isError } = useBillingSubscription();

  const plan = data;
  const hasActiveAccess =
    !!plan && ACCESS_ENABLED_STATUSES.includes(plan.status);

  return {
    plan,
    isLoading,
    isError,
    isLoaded: !!plan && !isLoading,
    hasActiveAccess,

    canSchedule: hasActiveAccess && !!plan?.allowScheduling,
    canUsePremiumAi: hasActiveAccess && !!plan?.allowPremiumAi,
    canUsePremiumImages: hasActiveAccess && !!plan?.allowPremiumImages,
    canUseMultiPage: hasActiveAccess && !!plan?.allowMultiPage,
    canUseAbTesting: hasActiveAccess && !!plan?.allowAbTesting,
    canUseApprovalFlow: hasActiveAccess && !!plan?.allowApprovalFlow,

    isFree: plan?.planCode === "FREE",
    isBasic: plan?.planCode === "BASIC",
    isPlus: plan?.planCode === "PLUS",
    isPro: plan?.planCode === "PRO",
  };
}