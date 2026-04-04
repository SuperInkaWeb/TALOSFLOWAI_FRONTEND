import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "../../../services/post.service";
import type { PagedResponse, PostItem } from "../../../types/post.types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function getFreshPublishedPost(postId: number): Promise<PostItem> {
  const maxAttempts = 6;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await sleep(500);

    const freshPost = await postService.getPostById(postId);

    const targetCompleted =
      freshPost.targets?.every(
        (target) => target.status === "SUCCESS" || target.status === "FAILED"
      ) ?? false;

    if (
      freshPost.status === "PUBLISHED" ||
      freshPost.status === "FAILED" ||
      targetCompleted
    ) {
      return freshPost;
    }
  }

  return postService.getPostById(postId);
}

export function usePublishPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      await postService.publishPost(postId);
      return getFreshPublishedPost(postId);
    },
    onSuccess: async (freshPost) => {
      queryClient.setQueryData(["post", freshPost.id], freshPost);

      queryClient.setQueriesData(
        { queryKey: ["posts"] },
        (oldData: PagedResponse<PostItem> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            items: oldData.items.map((item) =>
              item.id === freshPost.id ? freshPost : item
            ),
          };
        }
      );

      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}