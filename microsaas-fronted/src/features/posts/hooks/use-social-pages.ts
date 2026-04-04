import { useQuery } from "@tanstack/react-query";
import { socialService } from "../../../services/social.service";

export function useSocialPages() {
  return useQuery({
    queryKey: ["social-pages"],
    queryFn: socialService.getAllPages,
  });
}