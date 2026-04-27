import { api } from "./api";

export type MediaUploadResponse = {
  url: string;
};

function validateResponse(data: any): MediaUploadResponse {
  if (!data || typeof data.url !== "string" || data.url.length === 0) {
    throw new Error("Respuesta inválida del servidor al subir imagen");
  }

  return {
    url: data.url,
  };
}

export const mediaService = {
  async uploadAsset(file: File): Promise<MediaUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<MediaUploadResponse>(
      "/media/upload",
      formData
      // ❌ NO headers aquí
    );

    return validateResponse(response.data);
  },
};