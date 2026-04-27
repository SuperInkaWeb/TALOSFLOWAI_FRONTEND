import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aiService } from "../../../services/ai.service";
import type { RegeneratePostRequest } from "../../../types/ai.types";
import type { PostItem } from "../../../types/post.types";
import { syncPostCaches } from "../../posts/utils/post-cache.helpers";

type Payload = {
  postId: number;
  data: RegeneratePostRequest;
};

export function useRegeneratePostText() {
  const queryClient = useQueryClient();

  return useMutation<PostItem, Error, Payload>({
    mutationFn: ({ postId, data }) => aiService.regenerateText(postId, data),
    onSuccess: async (updatedPost) => {
      await syncPostCaches(queryClient, updatedPost);
    },
  });
}