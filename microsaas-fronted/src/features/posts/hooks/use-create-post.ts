import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "../../../services/post.service";
import type { CreatePostRequest } from "../../../types/post.types";

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePostRequest) => postService.createPost(payload),
    onSuccess: async (createdPost) => {
      queryClient.setQueryData(["post", createdPost.id], createdPost);

      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.refetchQueries({ queryKey: ["posts"] });

      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}