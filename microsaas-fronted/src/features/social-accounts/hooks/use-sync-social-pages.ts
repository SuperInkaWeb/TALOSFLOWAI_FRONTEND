import { useMutation, useQueryClient } from "@tanstack/react-query";
import { socialService } from "../../../services/social.service";

export function useSyncSocialPages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: number) => socialService.syncPages(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["social-pages"] });
    },
  });
}