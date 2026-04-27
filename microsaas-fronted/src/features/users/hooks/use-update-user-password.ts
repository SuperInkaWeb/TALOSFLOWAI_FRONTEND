import { message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { userService } from "../../../services/user.service";
import type { UpdateUserPasswordRequest } from "../../../types/user.types";

type Params = {
  userId: number;
  payload: UpdateUserPasswordRequest;
};

export function useUpdateUserPassword() {
  return useMutation({
    mutationFn: ({ userId, payload }: Params) =>
      userService.updateUserPassword(userId, payload),

    onError: (error: any) => {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "No se pudo actualizar la contraseña";

      message.error(backendMessage);
    },
  });
}