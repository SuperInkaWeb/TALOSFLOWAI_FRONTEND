import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "../../../services/post.service";
import type {
  PostItem,
  UpdatePostRequest,
} from "../../../types/post.types";
import { syncPostCaches } from "../utils/post-cache.helpers";

type UpdatePostPayload = {
  postId: number;
  data: UpdatePostRequest;
};

function normalizeNullableString(value?: string | null) {
  return value?.trim() || null;
}

function matchesUpdatedData(post: PostItem, data: UpdatePostRequest) {
  const sameContent =
    data.content === undefined || post.content === data.content;

  const sameMediaUrl =
    data.mediaUrl === undefined ||
    normalizeNullableString(post.mediaUrl) ===
      normalizeNullableString(data.mediaUrl);

  const sameScheduledAt =
    data.scheduledAt === undefined ||
    normalizeNullableString(post.scheduledAt) ===
      normalizeNullableString(data.scheduledAt);

  const sameTargets =
    data.targetPageIds === undefined ||
    JSON.stringify(
      [...post.targets.map((target) => target.socialPageId)].sort(
        (a, b) => a - b
      )
    ) === JSON.stringify([...data.targetPageIds].sort((a, b) => a - b));

  return sameContent && sameMediaUrl && sameScheduledAt && sameTargets;
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, data }: UpdatePostPayload) => {
      const updatedPost = await postService.updatePost(postId, data);

      try {
        const freshPost = await postService.getPostById(postId);

        if (matchesUpdatedData(freshPost, data)) {
          return freshPost;
        }

        return updatedPost;
      } catch (error) {
        console.warn(
          "No se pudo refrescar el post después del update, se usará la respuesta del PUT",
          error
        );
        return updatedPost;
      }
    },

    onSuccess: async (updatedPost) => {
      await syncPostCaches(queryClient, updatedPost);
    },
  });
}