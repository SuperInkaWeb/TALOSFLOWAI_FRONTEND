import { api } from "./api";
import type {
  PlatformOrganizationDetailResponse,
  PlatformOrganizationItem,
  UpdatePlatformOrganizationStatusRequest,
} from "../types/platform.types";

export const platformOrganizationService = {
  async getAll(): Promise<PlatformOrganizationItem[]> {
    const response = await api.get("/platform/organizations");
    return response.data;
  },

  async getDetail(id: number): Promise<PlatformOrganizationDetailResponse> {
    const response = await api.get(`/platform/organizations/${id}/detail`);
    return response.data;
  },

  async updateStatus(
    id: number,
    data: UpdatePlatformOrganizationStatusRequest
  ): Promise<PlatformOrganizationItem> {
    const response = await api.patch(`/platform/organizations/${id}/status`, data);
    return response.data;
  },
};