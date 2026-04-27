import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "../../../services/post.service";
import { syncPostCaches } from "../utils/post-cache.helpers";

export function useRestorePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => postService.restorePost(postId),
    onSuccess: async (updatedPost) => {
      await syncPostCaches(queryClient, updatedPost);
    },
  });
}