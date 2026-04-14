import { useQuery } from "@tanstack/react-query";
import { billingService } from "../../../services/billing.service";

export function useBillingSubscription() {
  return useQuery({
    queryKey: ["billing-subscription"],
    queryFn: () => billingService.getSubscription(),
  });
}