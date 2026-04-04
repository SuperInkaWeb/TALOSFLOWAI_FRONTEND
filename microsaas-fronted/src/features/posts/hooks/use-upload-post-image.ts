import { message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { mediaService } from "../../../services/media.service";

export function useUploadPostImage() {
  return useMutation({
    mutationFn: (file: File) => mediaService.uploadAsset(file),

    onError: (error: any) => {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "No se pudo subir la imagen del post";

      message.error(backendMessage);
    },
  });
}