import { useMutation, useQueryClient } from "@tanstack/react-query";
import { socialService } from "../../../services/social.service";

export function useDisconnectSocialAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: number) => socialService.disconnectAccount(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-accounts"] });
    },
  });
}