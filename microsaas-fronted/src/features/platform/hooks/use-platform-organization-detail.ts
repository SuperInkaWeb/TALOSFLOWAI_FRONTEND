import { useQuery } from "@tanstack/react-query";
import { platformOrganizationService } from "../../../services/platform-organization.service";

export function usePlatformOrganizationDetail(id?: number) {
  return useQuery({
    queryKey: ["platform-organization-detail", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("Organization id is required");
      }
      return platformOrganizationService.getDetail(id);
    },
    enabled: !!id,
  });
}