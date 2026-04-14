import { message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { brandService } from "../../../services/brand.service";
import type { UpdateBrandSocialLinkRequest } from "../../../types/brand.types";

type Payload = {
  id: number;
  data: UpdateBrandSocialLinkRequest;
};

export function useUpdateBrandSocialLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: Payload) =>
      brandService.updateSocialLink(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["brand-social-links"] });
      message.success("Red/contacto actualizada correctamente");
    },
    onError: (error: any) => {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "No se pudo actualizar la red/contacto";
      message.error(backendMessage);
    },
  });
}