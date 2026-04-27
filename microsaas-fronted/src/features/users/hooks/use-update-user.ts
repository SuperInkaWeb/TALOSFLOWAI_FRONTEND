import { message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../../services/user.service";
import type { UpdateUserRequest } from "../../../types/user.types";

type Params = {
  userId: number;
  payload: UpdateUserRequest;
};

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: Params) =>
      userService.updateUser(userId, payload),

    onSuccess: async (updatedUser) => {
      message.success("Usuario actualizado correctamente");
      queryClient.setQueryData(["user", updatedUser.id], updatedUser);
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error: any) => {
      const backendMessage =
        error?.response?.data?.message ||
        error?.message ||
        "No se pudo actualizar el usuario";

      message.error(backendMessage);
    },
  });
}