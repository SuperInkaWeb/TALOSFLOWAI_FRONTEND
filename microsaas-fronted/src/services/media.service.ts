import { api } from "./api";

export type MediaUploadResponse = {
  url: string;
};

export const mediaService = {
  async uploadAsset(file: File): Promise<MediaUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<MediaUploadResponse>(
      "/media/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};