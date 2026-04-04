import { useQuery } from "@tanstack/react-query";
import { brandService } from "../../../services/brand.service";

export function useBrandProfile() {
  return useQuery({
    queryKey: ["brand-profile"],
    queryFn: () => brandService.getProfile(),
  });
}