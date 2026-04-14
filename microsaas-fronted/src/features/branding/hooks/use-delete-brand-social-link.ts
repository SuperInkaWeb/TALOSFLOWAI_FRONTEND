import { message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { brandService } from "../../../services/brand.service";

export function useDeleteBrandSocialLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => brandService.deleteSocialLink(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["brand-social-links"] });
      message.success("Red/contacto eliminada correctamente");
    },
    onError: (error: any) => {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "No se pudo eliminar la red/contacto";
      message.error(backendMessage);
    },
  });
}