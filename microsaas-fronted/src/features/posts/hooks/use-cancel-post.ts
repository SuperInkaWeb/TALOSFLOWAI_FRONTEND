import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "../../../services/post.service";
import type { PagedResponse, PostItem } from "../../../types/post.types";

export function useCancelPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => postService.cancelPost(postId),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(["post", updatedPost.id], updatedPost);

      queryClient.setQueriesData(
        { queryKey: ["posts"] },
        (oldData: PagedResponse<PostItem> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            items: oldData.items.map((item) =>
              item.id === updatedPost.id ? updatedPost : item
            ),
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}