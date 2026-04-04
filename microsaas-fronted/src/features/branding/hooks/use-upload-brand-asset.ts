import { message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { brandService } from "../../../services/brand.service";

export function useUploadBrandAsset() {
  return useMutation({
    mutationFn: (file: File) => brandService.uploadAsset(file),
    onError: (error: any) => {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "No se pudo subir la imagen";
      message.error(backendMessage);
    },
  });
}