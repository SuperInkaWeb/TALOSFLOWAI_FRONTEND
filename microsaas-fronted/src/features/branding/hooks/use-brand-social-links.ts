import { useQuery } from "@tanstack/react-query";
import { brandService } from "../../../services/brand.service";

export function useBrandSocialLinks(activeOnly = false) {
  return useQuery({
    queryKey: ["brand-social-links", { activeOnly }],
    queryFn: () => brandService.getSocialLinks(activeOnly),
  });
}