import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { aiService } from "../../../services/ai.service";
import type {
  GenerateFullPostRequest,
  GenerateFullPostResponse,
} from "../../../types/ai.types";

type ApiErrorBody = {
  message?: string;
  error?: string;
  code?: string;
};

export function useGeneratePost() {
  const queryClient = useQueryClient();

  return useMutation<
    GenerateFullPostResponse,
    AxiosError<ApiErrorBody>,
    GenerateFullPostRequest
  >({
    mutationFn: aiService.generateFullPost,

    retry: (failureCount, error) => {
      const status = error.response?.status;
      const code = error.response?.data?.code || error.response?.data?.error;

      if (
        status === 400 ||
        status === 401 ||
        status === 403 ||
        status === 404 ||
        status === 409 ||
        status === 429
      ) {
        return false;
      }

      if (
        code === "PLAN_LIMIT_REACHED" ||
        code === "PLAN_ACCESS_DENIED" ||
        code === "AI_LIMIT_REACHED" ||
        code === "POST_LIMIT_REACHED" ||
        code === "IMAGE_REGEN_LIMIT_REACHED" ||
        code === "TEXT_REGEN_LIMIT_REACHED" ||
        code?.includes("LIMIT")
      ) {
        return false;
      }

      return failureCount < 1;
    },

    retryDelay: 2000,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["billing-usage"] }),
        queryClient.invalidateQueries({ queryKey: ["plan-access"] }),
      ]);
    },
  });
}