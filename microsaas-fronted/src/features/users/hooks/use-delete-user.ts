import { message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../../services/user.service";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => userService.deleteUser(userId),

    onSuccess: async () => {
      message.success("Usuario eliminado correctamente");
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error: any) => {
      const backendMessage =
        error?.response?.data?.message ||
        error?.message ||
        "No se pudo eliminar el usuario";

      message.error(backendMessage);
    },
  });
}