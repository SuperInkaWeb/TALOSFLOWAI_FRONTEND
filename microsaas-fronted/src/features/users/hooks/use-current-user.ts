import { useQuery } from "@tanstack/react-query";
import { userService } from "../../../services/user.service";

export function useCurrentUser(userId?: number) {
  return useQuery({
    queryKey: ["current-user", userId],
    queryFn: () => userService.getUserById(userId as number),
    enabled: !!userId,
  });
}