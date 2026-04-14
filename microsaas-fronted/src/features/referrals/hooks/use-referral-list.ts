import { useQuery } from "@tanstack/react-query";
import { referralService } from "../../../services/referral.service";

export function useReferralList() {
  return useQuery({
    queryKey: ["referral-list"],
    queryFn: referralService.getList,
  });
}