import { useQuery } from "@tanstack/react-query";
import { platformSecurityService } from "../../../services/platform-security.service";
import type { PlatformLoginAttemptsQuery } from "../../../types/platform.types";

export function usePlatformLoginAttempts(params: PlatformLoginAttemptsQuery) {
  return useQuery({
    queryKey: ["platform-login-attempts", params],
    queryFn: () => platformSecurityService.getLoginAttempts(params),
  });
}