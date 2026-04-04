import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aiService } from "../../../services/ai.service";
import type { RegeneratePostRequest } from "../../../types/ai.types";
import type { PostItem } from "../../../types/post.types";

type Payload = {
  postId: number;
  data: RegeneratePostRequest;
};

export function useRegeneratePostImage() {
  const queryClient = useQueryClient();

  return useMutation<PostItem, Error, Payload>({
    mutationFn: ({ postId, data }) => aiService.regenerateImage(postId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}