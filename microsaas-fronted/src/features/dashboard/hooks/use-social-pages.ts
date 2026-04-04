import { useQuery } from "@tanstack/react-query";
import { getAllSocialPages } from "../../../services/dashboard.service";

export function useSocialPages() {
  return useQuery({
    queryKey: ["dashboard", "social-pages"],
    queryFn: getAllSocialPages,
  });
}