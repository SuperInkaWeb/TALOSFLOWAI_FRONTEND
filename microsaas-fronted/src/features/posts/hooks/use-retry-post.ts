import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { postService } from "../../../services/post.service";
import type { PagedResponse, PostItem } from "../../../types/post.types";

export function useRetryPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => postService.retryPost(postId),

    onSuccess: (updatedPost) => {
      queryClient.setQueryData(["post", updatedPost.id], updatedPost);

      queryClient.setQueriesData(
        { queryKey: ["posts"] },
        (oldData: PagedResponse<PostItem> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            items: oldData.items.map((post) =>
              post.id === updatedPost.id ? updatedPost : post
            ),
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", updatedPost.id] });

      message.success("Publicación reintentada correctamente");
    },

    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "No se pudo reintentar la publicación";

      message.error(errorMessage);
    },
  });
}