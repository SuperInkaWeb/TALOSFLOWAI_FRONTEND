import { api } from "./api";
import type {
  BrandProfileResponse,
  BrandSocialLinkResponse,
  CreateBrandSocialLinkRequest,
  UpdateBrandSocialLinkRequest,
  UpsertBrandProfileRequest,
} from "../types/brand.types";

export type MediaUploadResponse = {
  url: string;
};

export const brandService = {
  async getProfile(): Promise<BrandProfileResponse | null> {
    const response = await api.get<BrandProfileResponse | null>("/brand/profile");
    return response.data;
  },

  async upsertProfile(
    payload: UpsertBrandProfileRequest
  ): Promise<BrandProfileResponse> {
    const response = await api.put<BrandProfileResponse>("/brand/profile", payload);
    return response.data;
  },

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

  async getSocialLinks(activeOnly = false): Promise<BrandSocialLinkResponse[]> {
    const response = await api.get<BrandSocialLinkResponse[]>("/brand/social-links", {
      params: { activeOnly },
    });
    return response.data;
  },

  async createSocialLink(
    payload: CreateBrandSocialLinkRequest
  ): Promise<BrandSocialLinkResponse> {
    const response = await api.post<BrandSocialLinkResponse>(
      "/brand/social-links",
      payload
    );
    return response.data;
  },

  async updateSocialLink(
    id: number,
    payload: UpdateBrandSocialLinkRequest
  ): Promise<BrandSocialLinkResponse> {
    const response = await api.put<BrandSocialLinkResponse>(
      `/brand/social-links/${id}`,
      payload
    );
    return response.data;
  },

  async deleteSocialLink(id: number): Promise<void> {
    await api.delete(`/brand/social-links/${id}`);
  },
};