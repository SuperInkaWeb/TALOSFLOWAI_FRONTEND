import { useMutation } from "@tanstack/react-query";
import { mediaService } from "../../../services/media.service";

export function useUploadPostImage() {
  return useMutation({
    mutationFn: (file: File) => mediaService.uploadAsset(file),
  });
}