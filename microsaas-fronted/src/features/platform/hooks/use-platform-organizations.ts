import { useQuery } from "@tanstack/react-query";
import { platformOrganizationService } from "../../../services/platform-organization.service";

export function usePlatformOrganizations() {
  return useQuery({
    queryKey: ["platform-organizations"],
    queryFn: () => platformOrganizationService.getAll(),
  });
}