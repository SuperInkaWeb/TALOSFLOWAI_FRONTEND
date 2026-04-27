import { useQuery } from "@tanstack/react-query";
import { billingService } from "../../../services/billing.service";

export function useBillingPlans() {
  return useQuery({
    queryKey: ["billing-plans"],
    queryFn: billingService.getPlans,
    staleTime: 5 * 60 * 1000,
  });
}