import { api } from "./api";
import type {
  PlatformLoginAttemptSummary,
  PlatformLoginAttemptsPageResponse,
  PlatformLoginAttemptsQuery,
} from "../types/platform.types";

export const platformSecurityService = {
  async getLoginAttempts(
    params: PlatformLoginAttemptsQuery
  ): Promise<PlatformLoginAttemptsPageResponse> {
    const response = await api.get("/platform/security/login-attempts", {
      params,
    });
    return response.data;
  },

  async getLoginAttemptsSummary(): Promise<PlatformLoginAttemptSummary> {
    const response = await api.get("/platform/security/login-attempts/summary");
    return response.data;
  },
};