import { useQuery } from "@tanstack/react-query";
import { billingService } from "../../../services/billing.service";

export function useBillingUsage() {
  return useQuery({
    queryKey: ["billing-usage"],
    queryFn: billingService.getUsage,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}