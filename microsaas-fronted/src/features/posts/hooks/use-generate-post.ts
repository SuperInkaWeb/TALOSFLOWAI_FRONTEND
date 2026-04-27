import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aiService } from "../../../services/ai.service";
import type {
  GenerateFullPostRequest,
  GenerateFullPostResponse,
} from "../../../types/ai.types";

export function useGeneratePost() {
  const queryClient = useQueryClient();

  return useMutation<GenerateFullPostResponse, Error, GenerateFullPostRequest>({
    mutationFn: aiService.generateFullPost,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] }),
      ]);
    },
  });
}