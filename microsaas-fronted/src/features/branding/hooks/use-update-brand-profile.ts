import { message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { brandService } from "../../../services/brand.service";
import type { UpsertBrandProfileRequest } from "../../../types/brand.types";

export function useUpdateBrandProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertBrandProfileRequest) =>
      brandService.upsertProfile(payload),
    onSuccess: async (data) => {
      queryClient.setQueryData(["brand-profile"], data);
      await queryClient.invalidateQueries({ queryKey: ["brand-profile"] });
      message.success("Branding guardado correctamente");
    },
    onError: (error: any) => {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "No se pudo guardar el branding";
      message.error(backendMessage);
    },
  });
}