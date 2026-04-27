import { api } from "./api";
import type { PlatformLoginRequest, PlatformLoginResponse } from "../types/platform.types";

export const platformAuthService = {
  async login(data: PlatformLoginRequest): Promise<PlatformLoginResponse> {
    const response = await api.post("/auth/platform/login", data);
    return response.data;
  },
};