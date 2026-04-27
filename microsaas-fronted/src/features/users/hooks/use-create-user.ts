import { message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../../services/user.service";
import type { CreateUserRequest } from "../../../types/user.types";

function extractErrorMessage(error: any): string {
  const data = error?.response?.data;

  console.log("CREATE USER ERROR FULL =>", error);
  console.log("CREATE USER ERROR RESPONSE =>", error?.response);
  console.log("CREATE USER ERROR DATA =>", data);

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data?.message && typeof data.message === "string") {
    return data.message;
  }

  if (data?.error && typeof data.error === "string") {
    return data.error;
  }

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    const firstError = data.errors[0];
    if (typeof firstError === "string") return firstError;
    if (firstError?.message) return firstError.message;
  }

  if (error?.message && error.message !== "Request failed with status code 403") {
    return error.message;
  }

  return "No se pudo crear el usuario";
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserRequest) => userService.createUser(payload),

    onSuccess: async () => {
      message.success("Usuario creado correctamente");
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error: any) => {
      message.error(extractErrorMessage(error));
    },
  });
}