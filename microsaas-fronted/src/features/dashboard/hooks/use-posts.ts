import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../../../services/dashboard.service";

export function usePosts() {
  return useQuery({
    queryKey: ["dashboard", "posts"],
    queryFn: getPosts,
  });
}