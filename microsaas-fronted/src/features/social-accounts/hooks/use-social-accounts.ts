import { useQuery } from "@tanstack/react-query";
import { socialService } from "../../../services/social.service";

export function useSocialAccounts() {
  return useQuery({
    queryKey: ["social-accounts"],
    queryFn: socialService.getAccounts,
  });
}