import { message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { brandService } from "../../../services/brand.service";
import type { CreateBrandSocialLinkRequest } from "../../../types/brand.types";

export function useCreateBrandSocialLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBrandSocialLinkRequest) =>
      brandService.createSocialLink(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["brand-social-links"] });
      message.success("Red/contacto agregado correctamente");
    },
    onError: (error: any) => {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "No se pudo crear la red/contacto";
      message.error(backendMessage);
    },
  });
}