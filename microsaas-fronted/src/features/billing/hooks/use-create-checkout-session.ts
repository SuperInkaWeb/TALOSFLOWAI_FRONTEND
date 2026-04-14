import { useMutation } from "@tanstack/react-query";
import { billingService } from "../../../services/billing.service";

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: (planId: number) => billingService.createCheckoutSession(planId),
  });
}