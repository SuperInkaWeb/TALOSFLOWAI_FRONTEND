import type {
  BillingPlanResponse,
  BillingSubscriptionResponse,
  BillingSubscriptionStatus,
} from "../../../types/billing.types";

const PORTAL_ALLOWED_STATUSES: BillingSubscriptionStatus[] = [
  "ACTIVE",
  "TRIALING",
  "PAST_DUE",
];

export function canUseCustomerPortal(
  subscription?: BillingSubscriptionResponse | null
): boolean {
  if (!subscription) return false;

  return (
    subscription.provider === "STRIPE" &&
    !!subscription.providerCustomerId &&
    !!subscription.providerSubscriptionId &&
    PORTAL_ALLOWED_STATUSES.includes(subscription.status)
  );
}

export function isCurrentPlan(
  subscription: BillingSubscriptionResponse | undefined,
  plan: BillingPlanResponse
): boolean {
  return subscription?.planId === plan.id;
}

export function getPlanActionLabel(
  subscription: BillingSubscriptionResponse | undefined,
  plan: BillingPlanResponse
): string {
  if (isCurrentPlan(subscription, plan)) return "Plan actual";
  if (canUseCustomerPortal(subscription)) return "Gestionar en Stripe";
  if (plan.priceCents === 0) return "Seleccionar";
  return "Elegir plan";
}