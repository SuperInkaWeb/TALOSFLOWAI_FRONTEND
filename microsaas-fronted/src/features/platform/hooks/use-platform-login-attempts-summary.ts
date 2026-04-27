import { useQuery } from "@tanstack/react-query";
import { platformSecurityService } from "../../../services/platform-security.service";

export function usePlatformLoginAttemptsSummary() {
  return useQuery({
    queryKey: ["platform-login-attempts-summary"],
    queryFn: () => platformSecurityService.getLoginAttemptsSummary(),
  });
}