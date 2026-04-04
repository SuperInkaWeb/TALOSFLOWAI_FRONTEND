import { useMutation, useQueryClient } from "@tanstack/react-query";
import { socialService } from "../../../services/social.service";

export function useActivateSocialAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: number) => socialService.activateAccount(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-accounts"] });
    },
  });
}