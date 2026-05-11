import { useQuery } from "@tanstack/react-query";
import { userService } from "../../../services/user.service";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: () => userService.getMe(),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}