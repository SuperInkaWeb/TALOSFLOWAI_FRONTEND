import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "../../../services/post.service";
import { syncPostCaches } from "../utils/post-cache.helpers";

export function useRetryPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => postService.retryPost(postId),
    onSuccess: async (updatedPost) => {
      await syncPostCaches(queryClient, updatedPost);
    },
  });
}