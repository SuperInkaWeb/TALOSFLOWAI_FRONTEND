import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "../../../services/post.service";
import type {
  PagedResponse,
  PostItem,
  ReschedulePostRequest,
} from "../../../types/post.types";

type ReschedulePostPayload = {
  postId: number;
  data: ReschedulePostRequest;
};

export function useReschedulePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: ReschedulePostPayload) =>
      postService.reschedulePost(postId, data),
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