import { useQuery } from "@tanstack/react-query";
import { referralService } from "../../../services/referral.service";

export function useReferralSummary() {
  return useQuery({
    queryKey: ["referral-summary"],
    queryFn: referralService.getSummary,
  });
}