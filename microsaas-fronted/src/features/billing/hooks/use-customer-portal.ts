import { useMutation } from "@tanstack/react-query";
import { billingService } from "../../../services/billing.service";

export function useCustomerPortal() {
  return useMutation({
    mutationFn: billingService.createCustomerPortal,
  });
}