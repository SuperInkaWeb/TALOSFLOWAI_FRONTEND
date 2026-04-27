import { useQuery } from "@tanstack/react-query";
import { postService } from "../../../services/post.service";
import type { PostStatus } from "../../../types/post.types";

type UsePostsParams = {
  page?: number;
  size?: number;
  status?: PostStatus;
};

export function usePosts(params: UsePostsParams = {}) {
  const { page = 0, size = 10, status } = params;

  return useQuery({
    queryKey: ["posts", { page, size, status }],
    queryFn: () => postService.getPosts({ page, size, status }),
    placeholderData: (previousData) => previousData,
  });
}