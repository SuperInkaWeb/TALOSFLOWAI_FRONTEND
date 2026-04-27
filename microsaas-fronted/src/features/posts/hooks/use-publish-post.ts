import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "../../../services/post.service";
import type { PostItem } from "../../../types/post.types";
import { syncPostCaches } from "../utils/post-cache.helpers";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function getFreshPublishedPost(postId: number): Promise<PostItem> {
  const maxAttempts = 6;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await sleep(500);

    try {
      const freshPost = await postService.getPostById(postId);

      const targetCompleted =
        !!freshPost.targets?.length &&
        freshPost.targets.every(
          (target) => target.status === "SUCCESS" || target.status === "FAILED"
        );

      if (
        freshPost.status === "PUBLISHED" ||
        freshPost.status === "FAILED" ||
        targetCompleted
      ) {
        return freshPost;
      }
    } catch (error) {
      console.error("Error consultando post publicado:", error);
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
      await syncPostCaches(queryClient, freshPost);
    },
  });
}